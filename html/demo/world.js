/*
  Stand-in game for the EliteUI demo: a small blocky world for the overlay to sit on.
  It is not part of EliteUI. A/D (or arrow keys) walk, W/S step forward and back,
  left Shift runs, Space jumps, and clicking throws a few sparks. It walks by itself
  when nobody touches it, so recordings and screenshots always have something moving.
*/
(function (global) {
  "use strict";

  const SEA = 62;
  function hash(n) {
    let h = Math.imul(n | 0, 0x27d4eb2d) ^ 0x165667b1;
    h = Math.imul(h ^ (h >>> 15), 0x85ebca6b);
    h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  }
  function smooth(x) {
    const i = Math.floor(x), f = x - i, t = f * f * (3 - 2 * f);
    return hash(i) * (1 - t) + hash(i + 1) * t;
  }
  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  function heightAt(x) {
    return Math.round(64 + (smooth(x / 26) - 0.5) * 18 + (smooth(x / 8 + 517) - 0.5) * 5);
  }
  function treeAt(x) {
    const roll = (n) => hash(n * 31 + 7) >= 0.88;
    if (heightAt(x) <= SEA + 1 || !roll(x) || roll(x - 1) || roll(x - 2)) return 0;
    return 4 + Math.floor(hash(x * 17 + 3) * 2);
  }

  // 8×8 block textures, generated once
  function texture(seed, pick) {
    const c = document.createElement("canvas");
    c.width = c.height = 8;
    const g = c.getContext("2d");
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        g.fillStyle = pick(x, y, hash(seed * 4099 + y * 8 + x));
        g.fillRect(x, y, 1, 1);
      }
    }
    return c;
  }
  const from = (list) => (r) => list[Math.floor(r * list.length) % list.length];
  const grassTop = from(["#6cbf45", "#5fae3b", "#57a336", "#74c74c"]);
  const dirt = from(["#8a5a35", "#7d5130", "#966540", "#73492b"]);
  const stone = from(["#80838a", "#73767d", "#8d9097", "#6a6d73"]);
  const sand = from(["#dcc78d", "#cfb97e", "#e6d39b", "#c9b277"]);
  const bark = from(["#6f4d2b", "#5f4124", "#7c5833"]);
  const leaf = from(["#3f8f3a", "#367e32", "#4aa044", "#2f7029"]);
  let TEX = null;
  function textures() {
    if (TEX) return TEX;
    TEX = {
      grass: texture(1, (x, y, r) => (y < 2 || (y === 2 && r < 0.5) ? grassTop(r) : dirt(r))),
      dirt: texture(2, (x, y, r) => dirt(r)),
      stone: texture(3, (x, y, r) => stone(r)),
      ore: texture(4, (x, y, r) => (r > 0.86 ? "#2b2d31" : stone(r))),
      sand: texture(5, (x, y, r) => sand(r)),
      log: texture(6, (x, y, r) => (x === 0 || x === 7 ? "#4f3620" : bark(r))),
      leaves: texture(7, (x, y, r) => (r > 0.9 ? "#245a20" : leaf(r)))
    };
    return TEX;
  }
  const SPARK = { grass: [95, 174, 59], dirt: [138, 90, 53], stone: [128, 131, 138], ore: [70, 72, 78], sand: [220, 199, 141] };

  // Sky colors through the day: [time, top, horizon]
  const SKY = [
    [0.0, "#070b1f", "#141a3a"], [0.2, "#1c2452", "#3b2f63"], [0.25, "#3e5aa8", "#f1a27c"],
    [0.32, "#5aa4ff", "#bfe0ff"], [0.5, "#4b98ff", "#cbe6ff"], [0.68, "#4a7fe0", "#ffd29a"],
    [0.75, "#3a3f86", "#f0866a"], [0.82, "#121838", "#2a2457"], [1.0, "#070b1f", "#141a3a"]
  ];
  function rgb(hex) { return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)); }
  function mix(a, b, t) {
    const x = rgb(a), y = rgb(b);
    return "rgb(" + x.map((v, i) => Math.round(v + (y[i] - v) * t)).join(", ") + ")";
  }
  function skyAt(t) {
    for (let i = 0; i < SKY.length - 1; i++) {
      const a = SKY[i], b = SKY[i + 1];
      if (t >= a[0] && t <= b[0]) {
        const k = (t - a[0]) / (b[0] - a[0]);
        return [mix(a[1], b[1], k), mix(a[2], b[2], k), a[2], b[2], k];
      }
    }
    return [SKY[0][1], SKY[0][2], SKY[0][2], SKY[0][2], 0];
  }
  function darkness(t) {
    if (t > 0.3 && t < 0.7) return 0;
    if (t >= 0.82 || t <= 0.18) return 1;
    if (t <= 0.3) return 1 - (t - 0.18) / 0.12;
    return (t - 0.7) / 0.12;
  }

  function create(canvas) {
    const ctx = canvas.getContext("2d");
    const T = textures();
    const state = { x: 8.5, y: 64, z: -24, facing: "East", time: 0.3 };
    const keys = new Set();
    const frameFns = [];
    const sparks = [];
    const stars = Array.from({ length: 70 }, (_, i) => [hash(i + 900), hash(i + 1900) * 0.55, 1 + Math.round(hash(i + 2900))]);
    let W = 1, H = 1, S = 32, camY = 64, jumpY = 0, vy = 0, cloudT = 0, lastInput = -Infinity;

    function resize() {
      const r = canvas.getBoundingClientRect();
      W = canvas.width = Math.max(1, Math.round(r.width));
      H = canvas.height = Math.max(1, Math.round(r.height));
      S = Math.max(18, Math.round(H / 16));
    }
    resize();
    if (global.ResizeObserver) new ResizeObserver(resize).observe(canvas);

    const screen = (bx, by) => [Math.floor((bx - state.x) * S + W / 2), Math.floor(H * 0.6 - (by + 1 - camY) * S)];
    function kindAt(bx, by) {
      const h = heightAt(bx), d = h - by;
      if (d < 0) return null;
      const beach = h <= SEA + 1;
      if (d === 0) return beach ? "sand" : "grass";
      if (d <= 3) return beach ? "sand" : "dirt";
      return hash(bx * 131 + by * 7) > 0.93 ? "ore" : "stone";
    }

    function update(dt) {
      const now = performance.now();
      let dir = 0, dz = 0;
      if (keys.has("KeyA") || keys.has("ArrowLeft")) dir -= 1;
      if (keys.has("KeyD") || keys.has("ArrowRight")) dir += 1;
      if (keys.has("KeyW") || keys.has("ArrowUp")) dz -= 1;
      if (keys.has("KeyS") || keys.has("ArrowDown")) dz += 1;
      const idle = now - lastInput > 6000;
      const speed = keys.has("ShiftLeft") ? 7.2 : 4.3;
      if (idle) {
        state.x += 1.4 * dt;
        state.facing = "East";
      } else {
        state.x += dir * speed * dt;
        state.z += dz * speed * 0.8 * dt;
        if (dir > 0) state.facing = "East";
        else if (dir < 0) state.facing = "West";
        else if (dz < 0) state.facing = "North";
        else if (dz > 0) state.facing = "South";
      }
      if (keys.has("Space") && jumpY === 0 && vy === 0) vy = 8.5;
      if (vy !== 0 || jumpY > 0) {
        jumpY += vy * dt;
        vy -= 26 * dt;
        if (jumpY <= 0) { jumpY = 0; vy = 0; }
      }
      state.time = (state.time + dt / 300) % 1; // a five-minute day
      state.y = heightAt(Math.floor(state.x)) + 1 + Math.round(jumpY);
      cloudT += dt;
    }

    function drawBody(x, y, size, color, glow) {
      const r = size * 2.6;
      const g = ctx.createRadialGradient(x, y, size * 0.3, x, y, r);
      g.addColorStop(0, glow);
      g.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = g;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
      ctx.fillStyle = color;
      ctx.fillRect(Math.floor(x - size / 2), Math.floor(y - size / 2), Math.ceil(size), Math.ceil(size));
    }

    function draw(dt) {
      ctx.imageSmoothingEnabled = false;
      const t = state.time;
      const sky = skyAt(t);
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, sky[0]);
      g.addColorStop(1, sky[1]);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      const dark = darkness(t);

      if (dark > 0) {
        ctx.fillStyle = "rgba(255, 255, 255, " + (0.8 * dark).toFixed(3) + ")";
        for (const [sx, sy, sz] of stars) ctx.fillRect(Math.floor(sx * W), Math.floor(sy * H), sz, sz);
      }
      const dayP = (t - 0.2) / 0.6;
      if (dayP > -0.05 && dayP < 1.05) {
        drawBody(W * (0.08 + 0.84 * dayP), H * 0.62 - Math.sin(Math.PI * clamp01(dayP)) * H * 0.5, S * 1.6, "#ffe58a", "rgba(255, 224, 140, 0.4)");
      }
      const nightP = ((t + 1 - 0.8) % 1) / 0.4;
      if (nightP >= 0 && nightP <= 1) {
        drawBody(W * (0.08 + 0.84 * nightP), H * 0.62 - Math.sin(Math.PI * nightP) * H * 0.48, S * 1.2, "#e6ebff", "rgba(205, 215, 255, 0.28)");
      }

      // Clouds drift with the wind and a little with the camera
      ctx.fillStyle = "rgba(255, 255, 255, " + (0.85 - dark * 0.55).toFixed(3) + ")";
      const span = W + 12 * S;
      for (let i = 0; i < 9; i++) {
        const base = hash(i + 70) * span;
        const x = ((((base - state.x * S * 0.25 - cloudT * S * 0.35) % span) + span) % span) - 6 * S;
        const y = H * (0.08 + hash(i + 170) * 0.24);
        const len = 3 + Math.floor(hash(i + 270) * 5);
        ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(len * S * 0.75), Math.floor(S * 0.5));
        ctx.fillRect(Math.floor(x + S * 0.75), Math.floor(y - S * 0.35), Math.floor((len - 2) * S * 0.75), Math.floor(S * 0.4));
      }

      // Distant hills (parallax)
      ctx.fillStyle = mix(sky[3], "#2f4a73", 0.55);
      const step = Math.max(4, Math.round(S / 2));
      for (let sx = 0; sx < W + step; sx += step) {
        const wx = (sx - W / 2) / (S * 0.5) + state.x * 0.4 + state.z * 0.15;
        const hh = (smooth(wx / 14 + 800) * 0.6 + smooth(wx / 5 + 900) * 0.25) * H * 0.3;
        const y = Math.floor(H * 0.62 - hh);
        ctx.fillRect(sx, y, step, H - y);
      }

      // Terrain
      const cx = Math.floor(state.x);
      let sum = 0;
      for (let i = -4; i <= 4; i++) sum += heightAt(cx + i);
      camY += (sum / 9 + 1 + jumpY * 0.6 - camY) * Math.min(1, dt * 4);
      const half = Math.ceil(W / S / 2) + 3;
      const bottomY = Math.floor(camY - (H * 0.45) / S) - 2;
      for (let bx = cx - half; bx <= cx + half; bx++) {
        const h = heightAt(bx);
        for (let by = h; by >= bottomY; by--) {
          const [sx, sy] = screen(bx, by);
          if (sy > H) break;
          const d = h - by;
          ctx.drawImage(T[kindAt(bx, by)], sx, sy, S, S);
          if (d > 0) {
            ctx.fillStyle = "rgba(0, 0, 0, " + Math.min(0.5, d * 0.07).toFixed(3) + ")";
            ctx.fillRect(sx, sy, S, S);
          }
        }
      }
      // Trees
      for (let bx = cx - half; bx <= cx + half; bx++) {
        const th = treeAt(bx);
        if (!th) continue;
        const h = heightAt(bx);
        for (let i = 1; i <= th; i++) {
          const [sx, sy] = screen(bx, h + i);
          ctx.drawImage(T.log, sx, sy, S, S);
        }
        for (let ly = h + th - 1; ly <= h + th + 1; ly++) {
          const reach = ly === h + th + 1 ? 1 : 2;
          for (let lx = bx - reach; lx <= bx + reach; lx++) {
            if (lx === bx && ly <= h + th) continue;
            const [sx, sy] = screen(lx, ly);
            ctx.drawImage(T.leaves, sx, sy, S, S);
          }
        }
      }
      // Water
      for (let bx = cx - half; bx <= cx + half; bx++) {
        const h = heightAt(bx);
        if (h >= SEA) continue;
        const [sx, top] = screen(bx, SEA);
        const bottom = screen(bx, h + 1)[1] + S;
        ctx.fillStyle = "rgba(48, 112, 230, 0.55)";
        ctx.fillRect(sx, top, S, bottom - top);
        ctx.fillStyle = "rgba(170, 210, 255, 0.55)";
        ctx.fillRect(sx, top, S, Math.max(2, Math.round(S * 0.12)));
      }
      if (dark > 0) {
        ctx.fillStyle = "rgba(6, 8, 28, " + (0.42 * dark).toFixed(3) + ")";
        ctx.fillRect(0, 0, W, H);
      }

      // Click sparks
      const px = Math.max(2, Math.round(S / 7));
      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i];
        p.life -= dt;
        if (p.life <= 0) { sparks.splice(i, 1); continue; }
        p.vy += 700 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        ctx.fillStyle = "rgba(" + p.c.join(", ") + ", " + Math.min(1, p.life * 2).toFixed(3) + ")";
        ctx.fillRect(Math.floor(p.x), Math.floor(p.y), px, px);
      }
    }

    // Input: only when the overlay isn't the thing being typed into or clicked
    const ignore = (e) => {
      const t = e.target;
      return !!(t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable || (t.closest && t.closest(".eui-root"))));
    };
    const MOVE = new Set(["KeyW", "KeyA", "KeyS", "KeyD", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Space", "ShiftLeft"]);
    global.addEventListener("keydown", (e) => {
      if (!MOVE.has(e.code) || ignore(e)) return;
      if (e.code === "Space" && e.target && e.target.closest && e.target.closest("button, [role=button]")) return;
      keys.add(e.code);
      lastInput = performance.now();
      if (e.code === "Space") e.preventDefault();
    });
    global.addEventListener("keyup", (e) => keys.delete(e.code));
    global.addEventListener("blur", () => keys.clear());
    canvas.addEventListener("pointerdown", (e) => {
      const r = canvas.getBoundingClientRect();
      const x = (e.clientX - r.left) * (W / r.width), y = (e.clientY - r.top) * (H / r.height);
      const bx = Math.floor((x - W / 2) / S + state.x);
      const by = Math.floor(camY - 1 + (H * 0.6 - y) / S);
      const kind = kindAt(bx, by);
      const color = kind ? SPARK[kind] : e.button === 2 ? [180, 220, 255] : [255, 236, 180];
      for (let i = 0; i < 9; i++) {
        sparks.push({ x, y, vx: (Math.random() - 0.5) * 260, vy: -Math.random() * 260 - 40, life: 0.45 + Math.random() * 0.3, c: color });
      }
    });

    let last = performance.now();
    function loop(now) {
      requestAnimationFrame(loop);
      const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
      last = now;
      update(dt);
      draw(dt);
      for (const fn of frameFns) fn();
    }
    requestAnimationFrame(loop);

    return {
      canvas,
      state,
      onFrame(fn) { frameFns.push(fn); }
    };
  }

  global.DemoWorld = { create };
})(typeof window !== "undefined" ? window : this);
