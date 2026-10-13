/*
  Recording engine for the EliteUI demo. It records the stand-in game canvas with the
  browser's MediaRecorder and can draw the HUD widgets into the video. A real tool would
  capture the game window instead (for example through the desktop host); the UI on top
  stays the same.

  The replay buffer keeps one or two recorders running in a staggered pair, so there is
  always one that started at least `seconds` ago. Saving stops that one and keeps it.
*/
(function (global) {
  "use strict";

  const TYPES = [
    ["WebM", "video/webm;codecs=vp9"], ["WebM", "video/webm;codecs=vp8"], ["WebM", "video/webm"],
    ["MP4", "video/mp4;codecs=avc1"], ["MP4", "video/mp4"]
  ];
  function supportedFormats() {
    const MR = global.MediaRecorder;
    if (!MR || !MR.isTypeSupported) return [];
    const out = [];
    TYPES.forEach(([name, type]) => {
      try { if (MR.isTypeSupported(type) && !out.some((f) => f.name === name)) out.push({ name, type }); } catch (e) { /* skip */ }
    });
    return out;
  }

  function create(source, opts) {
    opts = opts || {};
    const rec = document.createElement("canvas");
    const rctx = rec.getContext("2d");
    const formats = supportedFormats();
    const cfg = { width: 1280, height: 720, fps: 60, bitrate: 8, format: formats[0] ? formats[0].name : null, hud: true };
    const supported = !!(global.MediaRecorder && rec.captureStream && formats.length);
    let stream = null, pending = null, session = null;
    const buffer = { on: false, len: 30, slots: [], timer: null };

    const busy = () => !!session || buffer.on;
    function applySize() {
      rec.width = cfg.width;
      rec.height = cfg.height;
      if (stream) { stream.getTracks().forEach((t) => t.stop()); stream = null; }
    }
    applySize();
    const getStream = () => stream || (stream = rec.captureStream(cfg.fps));
    const mime = () => { const f = formats.find((x) => x.name === cfg.format) || formats[0]; return f ? f.type : ""; };

    // Cover-fit the game into the output size, then draw the HUD with the same transform.
    function paint(ctx, w, h) {
      const sw = source.width, sh = source.height;
      if (!sw || !sh) return;
      const scale = Math.max(w / sw, h / sh);
      const dw = sw * scale, dh = sh * scale, dx = (w - dw) / 2, dy = (h - dh) / 2;
      ctx.imageSmoothingEnabled = false;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(source, dx, dy, dw, dh);
      if (cfg.hud && opts.paintHud) {
        const css = source.getBoundingClientRect();
        ctx.imageSmoothingEnabled = true;
        opts.paintHud(ctx, { scale: (sw / css.width) * scale, dx, dy, left: css.left, top: css.top });
      }
    }
    function thumbnail() {
      const c = document.createElement("canvas");
      c.width = 320;
      c.height = 180;
      paint(c.getContext("2d"), 320, 180);
      return c.toDataURL("image/jpeg", 0.82);
    }
    function draw() { if (busy()) paint(rctx, rec.width, rec.height); }

    function newRecorder(onChunk) {
      const type = mime();
      const options = { videoBitsPerSecond: Math.round(cfg.bitrate * 1e6) };
      if (type) options.mimeType = type;
      paint(rctx, rec.width, rec.height);
      const mr = new MediaRecorder(getStream(), options);
      mr.ondataavailable = (e) => { if (e.data && e.data.size) onChunk(e.data); };
      mr.start(1000);
      return mr;
    }
    function finish(mr, chunks, meta) {
      const thumb = thumbnail();
      return new Promise((resolve) => {
        const done = () => {
          const type = (mr.mimeType || mime() || "video/webm").split(";")[0];
          const blob = new Blob(chunks, { type });
          resolve(Object.assign({ kind: "video", blob, type, size: blob.size, thumb, ext: /mp4/.test(type) ? "mp4" : "webm" }, meta));
        };
        mr.onstop = done;
        if (mr.state === "inactive") done();
        else mr.stop();
      });
    }
    function applyPending() {
      if (busy() || !pending) return;
      Object.assign(cfg, pending);
      pending = null;
      applySize();
    }

    // Recording
    function start() {
      if (!supported) throw new Error("This browser can't record video.");
      if (session) return;
      const s = { chunks: [], size: 0, markers: [], start: performance.now() };
      s.mr = newRecorder((d) => { s.chunks.push(d); s.size += d.size; });
      session = s;
    }
    function stop() {
      if (!session) return Promise.resolve(null);
      const s = session;
      const p = finish(s.mr, s.chunks, { duration: (performance.now() - s.start) / 1000, markers: s.markers.slice() });
      session = null;
      applyPending();
      return p;
    }

    // Replay buffer
    function startSlot() {
      const slot = { chunks: [], start: performance.now(), dead: false };
      slot.mr = newRecorder((d) => { if (!slot.dead) slot.chunks.push(d); });
      return slot;
    }
    function killSlot(slot) {
      slot.dead = true;
      try { if (slot.mr.state !== "inactive") slot.mr.stop(); } catch (e) { /* already stopped */ }
    }
    function tick() {
      const slots = buffer.slots;
      if (!slots.length) { slots.push(startSlot()); return; }
      const newest = slots[slots.length - 1];
      if (performance.now() - newest.start >= buffer.len * 1000) {
        if (slots.length >= 2) killSlot(slots.shift());
        slots.push(startSlot());
      }
    }
    function stopBuffer() {
      buffer.on = false;
      clearInterval(buffer.timer);
      buffer.slots.forEach(killSlot);
      buffer.slots = [];
      applyPending();
    }
    function setBuffer(on, seconds) {
      if (seconds) buffer.len = seconds;
      if (buffer.on) stopBuffer();
      if (!on || !supported) return false;
      buffer.on = true;
      buffer.slots = [startSlot()];
      buffer.timer = setInterval(tick, 500);
      return true;
    }
    function saveBuffer() {
      if (!buffer.on || !buffer.slots.length) return Promise.resolve(null);
      const slot = buffer.slots.shift();
      if (!buffer.slots.length) buffer.slots.push(startSlot());
      return finish(slot.mr, slot.chunks, { duration: (performance.now() - slot.start) / 1000, markers: [] });
    }
    const bufferAge = () => (buffer.slots.length ? Math.min(buffer.len, (performance.now() - buffer.slots[0].start) / 1000) : 0);

    // Screenshot of the game view, HUD included when that setting is on
    function screenshot() {
      const c = document.createElement("canvas");
      c.width = cfg.width;
      c.height = cfg.height;
      paint(c.getContext("2d"), c.width, c.height);
      const thumb = (() => {
        const t = document.createElement("canvas");
        t.width = 320;
        t.height = 180;
        t.getContext("2d").drawImage(c, 0, 0, 320, 180);
        return t.toDataURL("image/jpeg", 0.82);
      })();
      return new Promise((resolve) => {
        c.toBlob((blob) => resolve({ kind: "image", blob, type: "image/png", size: blob ? blob.size : 0, thumb, duration: 0, markers: [], ext: "png" }), "image/png");
      });
    }

    return {
      supported,
      formats,
      config: cfg,
      draw,
      // Returns false when the change has to wait for the current recording to end
      configure(next) {
        if (busy()) { pending = Object.assign(pending || {}, next); return false; }
        Object.assign(cfg, next);
        applySize();
        return true;
      },
      start,
      stop,
      isRecording: () => !!session,
      elapsed: () => (session ? (performance.now() - session.start) / 1000 : 0),
      size: () => (session ? session.size : 0),
      marker() {
        if (!session) return null;
        const t = (performance.now() - session.start) / 1000;
        session.markers.push(t);
        return t;
      },
      markerCount: () => (session ? session.markers.length : 0),
      setBuffer,
      bufferOn: () => buffer.on,
      bufferLength: () => buffer.len,
      bufferAge,
      saveBuffer,
      screenshot
    };
  }

  global.DemoCapture = { create, supportedFormats };
})(typeof window !== "undefined" ? window : this);
