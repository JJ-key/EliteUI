/*
  EliteUI — HTML template v0.2 "Glass"
  Browser port of roblox/Loader. The API keeps the Lua names so a script reads the same on
  both platforms; only `:` becomes `.`:

    Lua:  local Tab = Window:CreateTab("Main", "home")
    JS:   const Tab = Window.CreateTab("Main", "home")

  New in 0.2: three layouts (Sidebar, Tabs, Panels), modules (toggles with nested settings),
  12 three-color palettes + Chroma, command search, right-click menus with key binds,
  HUD overlays, streamer mode, capture protection (desktop host), share codes, graphs.

  Colors are CSS strings ("#8b5cf6") or EliteUI.Color3.fromRGB(139, 92, 246).
  Keys use KeyboardEvent.code ("ShiftRight"); Roblox names ("RightShift") also work.
*/
(function (global) {
  "use strict";

  const VERSION = "0.2.0";

  // ───────────────────────────────────────────────────────────── icons
  // Lucide icons (the Roblox build uses the same set as asset IDs).
  const ICON_PATHS = {
    home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
    player: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    "eye-off": '<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.53 13.53 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/>',
    star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
    zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
    sword: '<polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" x2="19" y1="19" y2="13"/><line x1="16" x2="20" y1="16" y2="20"/><line x1="19" x2="21" y1="21" y2="19"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    palette: '<circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.65-.75 1.65-1.69 0-.44-.18-.84-.44-1.13-.29-.29-.44-.65-.44-1.13a1.64 1.64 0 0 1 1.67-1.67h2c3.05 0 5.55-2.5 5.55-5.55C21.97 6.01 17.46 2 12 2z"/>',
    droplet: '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    folder: '<path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/>',
    code: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
    key: '<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/>',
    lock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    gamepad: '<line x1="6" x2="10" y1="12" y2="12"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="15" x2="15.01" y1="13" y2="13"/><line x1="18" x2="18.01" y1="11" y2="11"/><rect width="20" height="12" x="2" y="6" rx="2"/>',
    map: '<polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" x2="9" y1="3" y2="18"/><line x1="15" x2="15" y1="6" y2="21"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>',
    trash: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
    check: '<polyline points="20 6 9 17 4 12"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    minus: '<path d="M5 12h14"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>',
    "chevron-right": '<path d="m9 18 6-6-6-6"/>',
    music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
    activity: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
    crown: '<path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7z"/><path d="M5 20h14"/>',
    layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
    menu: '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
    volume: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>',
    image: '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21"/>',
    copy: '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
    rotate: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    keyboard: '<path d="M10 8h.01"/><path d="M12 12h.01"/><path d="M14 8h.01"/><path d="M16 12h.01"/><path d="M18 8h.01"/><path d="M6 8h.01"/><path d="M7 16h10"/><path d="M8 12h.01"/><rect width="20" height="16" x="2" y="4" rx="2"/>',
    sparkles: '<path d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.14-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0L14.06 8.5A2 2 0 0 0 15.5 9.94l6.14 1.58a.5.5 0 0 1 0 .96L15.5 14.06a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>',
    gauge: '<path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>',
    monitor: '<rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
    alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    "check-circle": '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
    "x-circle": '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>',
    sliders: '<line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/>',
    cpu: '<rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/>',
    columns: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/>',
    grid: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
    flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    radio: '<path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/><path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"/>',
    share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>'
  };
  const ICON_ALIASES = {
    world: "globe", bolt: "zap", lightning: "zap", close: "x", delete: "trash", remove: "trash",
    tool: "wrench", avatar: "player", character: "player", user: "player", team: "users",
    combat: "target", crosshair: "target", controller: "gamepad", chart: "activity",
    trending: "activity", vip: "star", notification: "bell", script: "code", terminal: "code",
    file: "folder", headphones: "music", camera: "image", reset: "rotate", warning: "alert",
    success: "check-circle", error: "x-circle", panels: "columns", layout: "grid", stream: "radio"
  };

  function icon(name) {
    if (!name) return null;
    if (/^(https?:|data:|\.{0,2}\/)/.test(name)) {
      const img = document.createElement("img");
      img.src = name;
      img.alt = "";
      img.className = "eui-ic";
      return img;
    }
    const key = String(name).toLowerCase();
    const body = ICON_PATHS[ICON_ALIASES[key] || key];
    if (!body) return null;
    const span = document.createElement("span");
    span.className = "eui-ic";
    span.setAttribute("aria-hidden", "true");
    span.innerHTML = '<svg class="eui-svg" viewBox="0 0 24 24">' + body + "</svg>";
    return span;
  }

  // ─────────────────────────────────────────────────────────── helpers
  function el(tag, cls, props) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (props) {
      for (const k in props) {
        if (props[k] == null) continue;
        if (k === "text") node.textContent = props[k];
        else node.setAttribute(k, props[k]);
      }
    }
    return node;
  }
  function safeCall(fn, ...args) {
    if (typeof fn !== "function") return undefined;
    try { return fn(...args); } catch (err) { console.error("[EliteUI] callback error:", err); return undefined; }
  }
  const clamp = (v, lo, hi) => (lo > hi ? (lo + hi) / 2 : Math.min(hi, Math.max(lo, v)));
  const isMac = /Mac|iPhone|iPad/.test((global.navigator && (navigator.platform || navigator.userAgent)) || "");
  const MOD = isMac ? "⌘" : "Ctrl";
  function isTyping(t) { return !!t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable); }
  function scrollIntoContainer(container, child, center) {
    const cr = container.getBoundingClientRect();
    const r = child.getBoundingClientRect();
    if (center) {
      container.scrollBy({ top: r.top - cr.top - cr.height / 2 + r.height / 2, behavior: "smooth" });
    } else if (r.top < cr.top) container.scrollTop -= cr.top - r.top + 4;
    else if (r.bottom > cr.bottom) container.scrollTop += r.bottom - cr.bottom + 4;
  }
  function fmtNum(v, step) {
    const d = step ? (String(step).split(".")[1] || "").length : (Math.abs(v) < 10 && v % 1 ? 1 : 0);
    return Number(v).toFixed(d);
  }

  // Colors
  function parseColor(c) {
    if (!c) return null;
    c = String(c).trim();
    let m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(c);
    if (m) {
      let h = m[1];
      if (h.length === 3) h = h.split("").map((x) => x + x).join("");
      return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
    }
    m = /^rgba?\(\s*(\d+)[ ,]+(\d+)[ ,]+(\d+)/i.exec(c);
    if (m) return { r: +m[1], g: +m[2], b: +m[3] };
    return null;
  }
  const hex2 = (n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  const rgbToHex = (c) => "#" + hex2(c.r) + hex2(c.g) + hex2(c.b);
  const rgba = (c, a) => "rgba(" + c.r + ", " + c.g + ", " + c.b + ", " + Math.round(a * 1000) / 1000 + ")";
  function rgbToHsv(c) {
    const r = c.r / 255, g = c.g / 255, b = c.b / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
    let h = 0;
    if (d) {
      if (max === r) h = ((g - b) / d) % 6;
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h *= 60;
      if (h < 0) h += 360;
    }
    return { h, s: max ? d / max : 0, v: max };
  }
  function hsvToRgb(h, s, v) {
    h = ((h % 360) + 360) % 360;
    const c = v * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = v - c;
    let r = 0, g = 0, b = 0;
    if (h < 60) [r, g, b] = [c, x, 0];
    else if (h < 120) [r, g, b] = [x, c, 0];
    else if (h < 180) [r, g, b] = [0, c, x];
    else if (h < 240) [r, g, b] = [0, x, c];
    else if (h < 300) [r, g, b] = [x, 0, c];
    else [r, g, b] = [c, 0, x];
    return { r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255 };
  }
  function luminance(c) {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  }
  function onColor(c) {
    const L = luminance(c);
    const white = 1.05 / (L + 0.05), dark = (L + 0.05) / 0.0535;
    return dark > white * 1.5 ? "#0b0b0f" : "#ffffff";
  }
  function shiftHue(hex, deg) {
    const c = parseColor(hex);
    if (!c) return hex;
    const h = rgbToHsv(c);
    return rgbToHex(hsvToRgb(h.h + deg, h.s, h.v));
  }
  const Color3 = {
    fromRGB(r, g, b) { return rgbToHex({ r, g, b }); },
    fromHex(hex) { return hex; },
    fromHSV(h, s, v) { return rgbToHex(hsvToRgb(h * 360, s, v)); }
  };
  function toCss(color) {
    if (color == null) return color;
    if (typeof color === "string") { const p = parseColor(color); return p ? rgbToHex(p) : color; }
    if (Array.isArray(color)) return Color3.fromRGB(color[0], color[1], color[2]);
    if (typeof color === "object" && "R" in color) {
      const k = color.R <= 1 && color.G <= 1 && color.B <= 1 ? 255 : 1;
      return Color3.fromRGB(color.R * k, color.G * k, color.B * k);
    }
    return String(color);
  }

  // Keys: Roblox Enum.KeyCode names → KeyboardEvent.code
  const KEY_ALIASES = {
    RightShift: "ShiftRight", LeftShift: "ShiftLeft", RightControl: "ControlRight", LeftControl: "ControlLeft",
    RightAlt: "AltRight", LeftAlt: "AltLeft", Return: "Enter"
  };
  function normalizeKey(k) {
    if (!k) return null;
    k = String(k).replace(/^Enum\.KeyCode\./, "");
    if (KEY_ALIASES[k]) return KEY_ALIASES[k];
    if (/^[A-Z]$/.test(k)) return "Key" + k;
    if (/^[0-9]$/.test(k)) return "Digit" + k;
    return k;
  }
  function keyLabel(code) {
    if (!code) return "None";
    return code
      .replace(/^Key/, "").replace(/^Digit/, "").replace(/^Numpad/, "Num ")
      .replace(/^(Shift|Control|Alt|Meta)(Left|Right)$/, "$2 $1")
      .replace("Control", "Ctrl").replace("Arrow", "");
  }

  // Storage (writefile/readfile on Roblox); falls back to memory when blocked.
  const memoryStore = {};
  const storage = {
    get(key) {
      try { const v = global.localStorage.getItem(key); if (v != null) return JSON.parse(v); } catch (e) { /* blocked */ }
      return Object.prototype.hasOwnProperty.call(memoryStore, key) ? memoryStore[key] : undefined;
    },
    set(key, value) {
      memoryStore[key] = value;
      try { global.localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* blocked */ }
    },
    remove(key) {
      delete memoryStore[key];
      try { global.localStorage.removeItem(key); } catch (e) { /* blocked */ }
    }
  };

  // ────────────────────────────────────────────────────────── defaults
  const PALETTES = {
    Violet:    { Primary: "#8b5cf6", Accent: "#a855f7", Tertiary: "#c084fc", Background: "#0d0b14", Secondary: "#1b1726" },
    Synthwave: { Primary: "#ec4899", Accent: "#8b5cf6", Tertiary: "#22d3ee", Background: "#0f0a16", Secondary: "#1e1428" },
    Ocean:     { Primary: "#0ea5e9", Accent: "#06b6d4", Tertiary: "#2dd4bf", Background: "#071018", Secondary: "#11202b" },
    Aurora:    { Primary: "#22c55e", Accent: "#06b6d4", Tertiary: "#8b5cf6", Background: "#08100f", Secondary: "#12201e" },
    Sunset:    { Primary: "#f97316", Accent: "#ec4899", Tertiary: "#8b5cf6", Background: "#120b0c", Secondary: "#22161a" },
    Rose:      { Primary: "#f43f5e", Accent: "#ec4899", Tertiary: "#fb7185", Background: "#120a0e", Secondary: "#22141a" },
    Gold:      { Primary: "#f59e0b", Accent: "#eab308", Tertiary: "#fde68a", Background: "#110e07", Secondary: "#221c10" },
    Emerald:   { Primary: "#10b981", Accent: "#34d399", Tertiary: "#a3e635", Background: "#07110d", Secondary: "#13201b" },
    Ice:       { Primary: "#60a5fa", Accent: "#7dd3fc", Tertiary: "#e0f2fe", Background: "#0a0e14", Secondary: "#161d28" },
    Crimson:   { Primary: "#dc2626", Accent: "#ef4444", Tertiary: "#f97316", Background: "#100808", Secondary: "#201213" },
    Candy:     { Primary: "#f472b6", Accent: "#a78bfa", Tertiary: "#38bdf8", Background: "#110c14", Secondary: "#1f1726" },
    Graphite:  { Primary: "#e5e7eb", Accent: "#9ca3af", Tertiary: "#6b7280", Background: "#0b0b0d", Secondary: "#1a1a1e" }
  };
  const DEFAULTS = {
    Theme: {
      Primary: "#8b5cf6", Accent: "#a855f7", Tertiary: "#c084fc",
      Background: "#0d0b14", Secondary: "#1b1726", Text: "#f4f2fa", TextSecondary: "#a8a4b8"
    },
    Layout: "Sidebar",               // "Sidebar" | "Tabs" | "Panels"
    Palette: null,                   // a PALETTES name; overrides Theme colors it defines
    ToggleKey: "ShiftRight",
    PanicKey: null,
    MobileGesture: { Enabled: true, Fingers: 3, HoldDuration: 0.8 },
    Animation: { Enabled: true },
    SaveSettings: { Enabled: true, FolderName: "EliteUI", FileName: "settings.json", ConfigFolder: "Configs" },
    UIScale: { PC: 1, Mobile: 1, Tablet: 1 },
    SnowEffect: { Enabled: false, ParticleCount: 50, Speed: 1, Glow: true },
    Particles: null,                 // "None" | "Snow" | "Embers"; null follows SnowEffect
    ParticleCount: 50,
    Backdrop: "Dim",                 // "Aurora" | "Dim" | "None"
    Acrylic: true,
    Glow: 60,
    Roundness: 14,
    HUD: { Watermark: false, ActiveList: false },
    StreamerMode: false,
    Search: true
  };
  const THEME_VARS = {
    Primary: "--eui-primary", Accent: "--eui-accent", Tertiary: "--eui-tertiary", Background: "--eui-background",
    Secondary: "--eui-secondary", Text: "--eui-text", TextSecondary: "--eui-text-secondary"
  };
  const SWATCHES = ["#8b5cf6", "#a855f7", "#ec4899", "#f43f5e", "#f97316", "#f59e0b", "#22c55e", "#14b8a6", "#06b6d4", "#3b82f6"];
  const LAYOUTS = ["Sidebar", "Tabs", "Panels"];
  const TYPE_ICON = { info: "bell", success: "check-circle", warning: "alert", error: "x-circle" };
  const reducedMotion = () => !!(global.matchMedia && global.matchMedia("(prefers-reduced-motion: reduce)").matches);
  function normLayout(n) {
    if (!n) return "Sidebar";
    n = String(n);
    if (/^window$/i.test(n)) return "Sidebar";
    if (/^(clickgui|dropdown)s?$/i.test(n)) return "Panels";
    const hit = LAYOUTS.find((l) => l.toLowerCase() === n.toLowerCase());
    return hit || "Sidebar";
  }
  function merge(base, extra) {
    const out = {};
    for (const k in base) out[k] = base[k] && typeof base[k] === "object" && !Array.isArray(base[k]) ? Object.assign({}, base[k]) : base[k];
    for (const k in extra || {}) {
      const v = extra[k];
      if (v === undefined) continue;
      if (out[k] && typeof out[k] === "object" && v && typeof v === "object") Object.assign(out[k], v);
      else if (k === "Animation" && typeof v === "boolean") out[k].Enabled = v;
      else out[k] = v;
    }
    return out;
  }

  // ════════════════════════════════════════════════════════ CreateWindow
  function CreateWindow(options) {
    options = options || {};
    const pick = {};
    ["Theme", "Layout", "Palette", "ToggleKey", "PanicKey", "MobileGesture", "Animation", "UIScale", "SnowEffect",
      "Particles", "ParticleCount", "Backdrop", "Acrylic", "Glow", "Roundness", "HUD", "StreamerMode", "Search"]
      .forEach((k) => { pick[k] = options[k]; });
    pick.SaveSettings = {
      FolderName: options.SaveFolder || DEFAULTS.SaveSettings.FolderName,
      FileName: options.SaveFile || DEFAULTS.SaveSettings.FileName,
      ConfigFolder: options.ConfigFolder || DEFAULTS.SaveSettings.ConfigFolder
    };
    const Config = merge(DEFAULTS, pick);
    if (options.Theme && !options.Theme.Tertiary) Config.Theme.Tertiary = options.Theme.Accent || options.Theme.Primary || Config.Theme.Tertiary;
    for (const k in Config.Theme) Config.Theme[k] = toCss(Config.Theme[k]);
    Config.ToggleKey = normalizeKey(Config.ToggleKey);
    if (Config.Particles == null) Config.Particles = Config.SnowEffect.Enabled ? "Snow" : "None";
    if (options.SnowEffect && options.SnowEffect.ParticleCount && !options.ParticleCount) Config.ParticleCount = options.SnowEffect.ParticleCount;

    const parent = options.Parent || document.body;
    const folder = Config.SaveSettings.FolderName;
    const settingsKey = folder + "/" + Config.SaveSettings.FileName;
    const configPrefix = folder + "/" + Config.SaveSettings.ConfigFolder + "/";
    const host = global.EliteUIHost || null;
    const canProtect = !!(host && typeof host.setContentProtection === "function");
    const cleanups = [];
    const on = (target, type, fn, opts) => { target.addEventListener(type, fn, opts); cleanups.push(() => target.removeEventListener(type, fn, opts)); };

    const W = {
      Name: options.Name || "EliteUI",
      Version: VERSION,
      Config,
      Tabs: [],
      Flags: {},
      Settings: (Config.SaveSettings.Enabled && storage.get(settingsKey)) || {},
      NotificationsEnabled: true
    };
    W.SaveSettings = function (key, value) {
      W.Settings[key] = value;
      if (Config.SaveSettings.Enabled) storage.set(settingsKey, W.Settings);
    };
    W.GetSetting = function (key, fallback) {
      return Object.prototype.hasOwnProperty.call(W.Settings, key) ? W.Settings[key] : fallback;
    };
    const pref = W.GetSetting;

    // Resolved preferences (saved value wins over the script's option)
    const state = {
      layout: normLayout(pref("EliteUI_Layout", Config.Layout)),
      glow: pref("EliteUI_Glow", Config.Glow),
      roundness: pref("EliteUI_Roundness", Config.Roundness),
      acrylic: pref("EliteUI_Acrylic", Config.Acrylic),
      backdrop: pref("EliteUI_Backdrop", Config.Backdrop),
      particles: pref("EliteUI_Particles", Config.Particles),
      motion: pref("EliteUI_Animations", !Config.Animation.Enabled ? "Off" : reducedMotion() ? "Reduced" : "Full"),
      watermark: pref("EliteUI_Watermark", !!Config.HUD.Watermark),
      activeList: pref("EliteUI_ActiveList", !!Config.HUD.ActiveList),
      streamer: pref("EliteUI_StreamerMode", !!Config.StreamerMode),
      chroma: pref("EliteUI_Chroma", false),
      chromaSpeed: pref("EliteUI_ChromaSpeed", 4),
      notifications: pref("EliteUI_ShowNotifications", true),
      palette: pref("EliteUI_Palette", Config.Palette),
      scale: null
    };
    Config.ToggleKey = normalizeKey(pref("EliteUI_ToggleKey", Config.ToggleKey));
    W.NotificationsEnabled = state.notifications;
    if (state.palette && PALETTES[state.palette]) Object.assign(Config.Theme, PALETTES[state.palette]);
    ["Primary", "Accent", "Tertiary", "Background", "Secondary"].forEach((k) => {
      const v = pref("EliteUI_Color_" + k);
      if (v) Config.Theme[k] = toCss(v);
    });

    // ─────────────────────────────────────────────────────────── DOM
    const root = el("div", "eui-root");
    if (parent === document.body) root.style.position = "fixed";
    const backdrop = el("div", "eui-backdrop", { "aria-hidden": "true" });
    backdrop.append(el("div", "eui-blob"), el("div", "eui-blob"), el("div", "eui-blob"));
    const fx = el("canvas", "eui-fx", { "aria-hidden": "true" });

    const logos = [];
    function makeLogo() { const l = el("div", "eui-logo", { "aria-hidden": "true" }); logos.push(l); return l; }
    function iconBtn(name, label, cls) {
      const b = el("button", "eui-icon-btn" + (cls ? " " + cls : ""), { type: "button", "aria-label": label, title: label });
      b.append(icon(name));
      return b;
    }
    function searchTrigger() {
      const b = el("button", "eui-search-trigger", { type: "button", "aria-label": "Search (" + MOD + " K)" });
      b.append(icon("search"), el("span", "eui-search-label", { text: "Search" }), el("span", "eui-kbd", { text: MOD + " K" }));
      b.addEventListener("click", () => openPalette());
      return b;
    }

    const win = el("section", "eui-window is-hidden", { "aria-label": W.Name });
    const header = el("div", "eui-header");
    const brand = el("div", "eui-brand");
    const title = el("div", "eui-title", { text: W.Name });
    brand.append(makeLogo(), title);
    if (options.Subtitle) brand.append(el("span", "eui-chip", { text: options.Subtitle }));
    header.append(brand);
    if (Config.Search) header.append(searchTrigger());
    const gearBtn = iconBtn("settings", "Settings", "eui-gear-btn");
    const minBtn = iconBtn("minus", "Minimize");
    const closeBtn = iconBtn("x", "Close", "is-close");
    header.append(gearBtn, minBtn, closeBtn);

    const body = el("div", "eui-body");
    const side = el("aside", "eui-side");
    const nav = el("nav", "eui-nav", { "aria-label": "Tabs" });
    const pill = el("div", "eui-nav-pill", { "aria-hidden": "true" });
    nav.append(pill);
    const user = options.User || {};
    const profile = el("button", "eui-profile", { type: "button", "aria-label": "Open settings" });
    const avatar = el("span", "eui-avatar", { "data-sensitive": "" });
    if (user.Avatar) avatar.append(el("img", "", { src: user.Avatar, alt: "" }));
    else avatar.append(el("span", "", { text: (user.Name || "Player").charAt(0).toUpperCase() }));
    const profileText = el("span", "eui-profile-text");
    const profileName = el("span", "eui-profile-name", { text: user.Name || "Player", "data-sensitive": "" });
    profileText.append(profileName, el("span", "eui-profile-sub", { text: "Settings" }));
    profile.append(avatar, profileText, icon("settings"));
    side.append(nav, profile);
    const main = el("div", "eui-main");
    body.append(side, main);
    const grip = el("div", "eui-grip", { "aria-hidden": "true" });
    grip.innerHTML = '<svg class="eui-svg" viewBox="0 0 24 24"><path d="M20 12 12 20"/><path d="M20 5 5 20"/></svg>';
    win.append(header, body, grip);

    const panels = el("div", "eui-panels");
    panels.hidden = true;
    const dock = el("div", "eui-dock eui-glass-chip", { role: "toolbar", "aria-label": W.Name });
    dock.hidden = true;
    const dockSettings = iconBtn("settings", "Settings");
    const dockLayout = iconBtn("grid", "Switch layout");
    const dockClose = iconBtn("x", "Close", "is-close");
    dock.append(makeLogo(), el("span", "eui-dock-name", { text: W.Name }));
    if (Config.Search) dock.append(searchTrigger());
    dock.append(dockSettings, dockLayout, dockClose);

    const wm = el("div", "eui-hud eui-watermark eui-glass-chip", { "aria-hidden": "true" });
    const wmFps = el("span", "eui-wm-stat");
    const wmDot = el("i", "eui-wm-dot");
    const wmFpsText = document.createTextNode("-- fps");
    wmFps.append(wmDot, wmFpsText);
    const wmTime = el("span", "eui-wm-stat");
    wm.append(makeLogo(), el("span", "eui-wm-name", { text: W.Name }), el("span", "eui-wm-sep"), wmFps, el("span", "eui-wm-sep"), wmTime);
    wm.hidden = true;
    const activeHud = el("div", "eui-hud eui-active", { "aria-hidden": "true" });
    activeHud.hidden = true;
    const layer = el("div", "eui-layer");
    const toasts = el("div", "eui-toasts", { "aria-live": "polite" });
    root.append(backdrop, fx, win, panels, dock, wm, activeHud, layer, toasts);
    parent.appendChild(root);

    // ───────────────────────────────────────────────────────── theme
    let chromaOffset = 0;
    const graphs = new Set();
    function paintTheme() {
      const t = Config.Theme;
      const shift = state.chroma ? chromaOffset : 0;
      for (const k in THEME_VARS) {
        const v = shift && (k === "Primary" || k === "Accent" || k === "Tertiary") ? shiftHue(t[k], shift) : t[k];
        root.style.setProperty(THEME_VARS[k], v);
      }
      const p = parseColor(shift ? shiftHue(t.Primary, shift) : t.Primary) || { r: 139, g: 92, b: 246 };
      const g = Math.max(0, Math.min(100, state.glow)) / 60;
      root.style.setProperty("--eui-glow-strong", rgba(p, Math.min(0.9, 0.5 * g)));
      root.style.setProperty("--eui-glow-soft", rgba(p, Math.min(0.6, 0.24 * g)));
      root.style.setProperty("--eui-on-primary", onColor(p));
    }
    function applyTheme() { paintTheme(); graphs.forEach((d) => d()); }
    function applyMaterial() {
      root.style.setProperty("--eui-radius", state.roundness + "px");
      win.classList.toggle("is-solid", !state.acrylic);
      root.classList.toggle("eui--solid", !state.acrylic);
      backdrop.dataset.mode = String(state.backdrop || "None").toLowerCase();
      root.classList.toggle("eui--streamer", !!state.streamer);
      root.classList.remove("eui--motion-reduced", "eui--motion-off");
      if (state.motion === "Reduced") root.classList.add("eui--motion-reduced");
      if (state.motion === "Off") root.classList.add("eui--motion-off");
    }
    function setLogo(src) {
      logos.forEach((l) => {
        l.textContent = "";
        if (src) l.append(el("img", "", { src, alt: "" }));
        else l.textContent = W.Name.charAt(0).toUpperCase();
      });
    }

    // ───────────────────────────────────────────────── sizing + layout
    let compact = false;
    let detected = false;
    let customSize = pref("EliteUI_WindowSize", null);
    let pos = pref("EliteUI_WindowPos", null);
    const segs = new Set();
    function applySize() {
      const dims = compact ? [440, 620] : customSize || [720, 500];
      root.style.setProperty("--eui-w", dims[0] + "px");
      root.style.setProperty("--eui-h", dims[1] + "px");
      root.style.setProperty("--eui-scale", String(state.scale || 1));
    }
    function applyPos() {
      if (!pos || compact) { win.style.left = ""; win.style.top = ""; return; }
      win.style.left = pos.x * 100 + "%";
      win.style.top = pos.y * 100 + "%";
    }
    function detect() {
      const coarse = !!(global.matchMedia && global.matchMedia("(pointer: coarse)").matches);
      const next = coarse || root.clientWidth < 700 || root.clientHeight < 480;
      if (next !== compact || !detected) {
        compact = next;
        detected = true;
        root.classList.toggle("eui--compact", compact);
        if (state.scale == null) state.scale = pref("EliteUI_UIScale", Math.round((compact ? Config.UIScale.Mobile : Config.UIScale.PC) * 100)) / 100;
        applySize();
        applyPos();
      }
      relayout();
      if (state.layout === "Panels") placePanels();
    }
    function relayout() { movePill(); segs.forEach((s) => s.layout()); graphs.forEach((d) => d()); }
    if (global.ResizeObserver) {
      const ro = new ResizeObserver(() => detect());
      ro.observe(root);
      const ro2 = new ResizeObserver(() => relayout());
      ro2.observe(win);
      cleanups.push(() => { ro.disconnect(); ro2.disconnect(); });
    }

    // Drag helper: tracks the pointer on the document once pressed, and only counts as a drag
    // after a 4px move so taps and clicks still work.
    function draggable(handle, h) {
      let lastMoved = false;
      handle.addEventListener("pointerdown", (e) => {
        if (e.button !== 0) return;
        const b = e.target.closest("button, input, .eui-no-drag");
        if (b && b !== handle) return;
        if (h.canStart && !h.canStart(e)) return;
        const s = { x: e.clientX, y: e.clientY, id: e.pointerId, moved: false };
        lastMoved = false;
        const move = (ev) => {
          if (ev.pointerId !== s.id) return;
          const dx = ev.clientX - s.x, dy = ev.clientY - s.y;
          if (!s.moved) {
            if (Math.hypot(dx, dy) < 4) return;
            s.moved = true;
            if (h.begin) h.begin(s);
          }
          h.move(dx, dy, s);
        };
        const up = (ev) => {
          if (ev.pointerId !== s.id) return;
          document.removeEventListener("pointermove", move);
          document.removeEventListener("pointerup", up);
          document.removeEventListener("pointercancel", up);
          lastMoved = s.moved;
          if (s.moved && h.end) h.end(s);
        };
        document.addEventListener("pointermove", move);
        document.addEventListener("pointerup", up);
        document.addEventListener("pointercancel", up);
      });
      return () => lastMoved;
    }

    draggable(header, {
      canStart: () => !compact,
      begin(s) {
        const r = win.getBoundingClientRect(), pr = root.getBoundingClientRect();
        Object.assign(s, { cx: r.left - pr.left + r.width / 2, cy: r.top - pr.top + r.height / 2, w: r.width, h: r.height, pw: pr.width, ph: pr.height });
        win.classList.add("is-dragging");
      },
      move(dx, dy, s) {
        const x = clamp(s.cx + dx, s.w / 2, s.pw - s.w / 2);
        const y = clamp(s.cy + dy, s.h / 2, s.ph - s.h / 2);
        pos = { x: x / s.pw, y: y / s.ph };
        win.style.left = x + "px";
        win.style.top = y + "px";
      },
      end() { win.classList.remove("is-dragging"); applyPos(); W.SaveSettings("EliteUI_WindowPos", pos); }
    });
    header.addEventListener("dblclick", (e) => { if (!e.target.closest("button")) W.Minimize(); });

    draggable(grip, {
      begin(s) {
        const r = win.getBoundingClientRect(), pr = root.getBoundingClientRect();
        Object.assign(s, { cx: r.left - pr.left + r.width / 2, cy: r.top - pr.top + r.height / 2, w: r.width, h: r.height, pw: pr.width, ph: pr.height });
        win.classList.add("is-resizing");
      },
      move(dx, dy, s) {
        const k = state.scale || 1;
        const w = clamp(s.w + dx, 560, s.pw - 24), h = clamp(s.h + dy, 380, s.ph - 24);
        customSize = [Math.round(w / k), Math.round(h / k)];
        applySize();
        pos = { x: (s.cx + (w - s.w) / 2) / s.pw, y: (s.cy + (h - s.h) / 2) / s.ph };
        applyPos();
        relayout();
      },
      end() { win.classList.remove("is-resizing"); W.SaveSettings("EliteUI_WindowSize", customSize); W.SaveSettings("EliteUI_WindowPos", pos); }
    });

    // ──────────────────────────────────────────── visibility + minimize
    let visible = false, minimized = false, panicked = false, floatButton = null;
    function applyVisibility() {
      const panelsMode = state.layout === "Panels";
      win.classList.toggle("is-hidden", !visible || panelsMode);
      panels.hidden = !(visible && panelsMode);
      dock.hidden = panels.hidden;
      root.classList.toggle("is-open", visible);
      if (floatButton) floatButton._sync();
      if (!visible) { closePopover(); closeOverlays(); }
    }
    W.Show = function () { visible = true; applyVisibility(); requestAnimationFrame(relayout); };
    W.Hide = function () { visible = false; applyVisibility(); };
    W.Toggle = function () { visible ? W.Hide() : W.Show(); };
    W.IsVisible = () => visible;
    W.Minimize = function (stateArg) {
      minimized = stateArg == null ? !minimized : !!stateArg;
      win.classList.toggle("is-min", minimized);
      minBtn.setAttribute("aria-label", minimized ? "Restore" : "Minimize");
      minBtn.title = minimized ? "Restore" : "Minimize";
    };
    W.Panic = function (stateArg) {
      panicked = stateArg == null ? !panicked : !!stateArg;
      root.style.visibility = panicked ? "hidden" : "";
      if (panicked) { closePopover(); closeOverlays(); }
    };
    closeBtn.addEventListener("click", () => W.Hide());
    dockClose.addEventListener("click", () => W.Hide());
    minBtn.addEventListener("click", () => W.Minimize());

    // ───────────────────────────────────────────────────── popovers
    let pop = null;
    function openPopover(anchor, node, opt) {
      opt = opt || {};
      closePopover();
      node.classList.add("eui-pop");
      node.tabIndex = -1;
      layer.append(node);
      const rr = root.getBoundingClientRect();
      node.style.maxHeight = Math.max(160, rr.height - 16) + "px";
      let ax, ay, aw = 0, ah = 0;
      if (opt.point) { ax = opt.point.x - rr.left; ay = opt.point.y - rr.top; }
      else {
        const ar = anchor.getBoundingClientRect();
        ax = ar.left - rr.left; ay = ar.top - rr.top; aw = ar.width; ah = ar.height;
        if (opt.matchWidth) node.style.minWidth = Math.max(180, aw) + "px";
      }
      const pw = node.offsetWidth, ph = node.offsetHeight;
      const left = clamp(opt.point ? ax : ax + aw - pw, 8, rr.width - pw - 8);
      let top = ay + ah + 6, below = true;
      if (top + ph > rr.height - 8) {
        if (ay - ph - 6 >= 8) { top = ay - ph - 6; below = false; }
        else top = Math.max(8, rr.height - ph - 8);
      }
      node.style.left = left + "px";
      node.style.top = top + "px";
      node.style.setProperty("--ox", clamp(ax + aw / 2 - left, 0, pw) + "px");
      node.style.setProperty("--oy", below ? "0%" : "100%");
      pop = { node, anchor, onClose: opt.onClose };
      if (anchor) anchor.setAttribute("aria-expanded", "true");
      return node;
    }
    function closePopover() {
      if (!pop) return;
      const p = pop;
      pop = null;
      p.node.remove();
      if (p.anchor) p.anchor.setAttribute("aria-expanded", "false");
      safeCall(p.onClose);
    }
    on(document, "pointerdown", (e) => {
      if (pop && !pop.node.contains(e.target) && !(pop.anchor && pop.anchor.contains(e.target))) closePopover();
    }, true);
    on(root, "scroll", (e) => { if (pop && !pop.node.contains(e.target)) closePopover(); }, true);

    function openMenu(anchor, items, opt) {
      opt = opt || {};
      const node = el("div", "", { role: opt.select ? "listbox" : "menu", "aria-label": opt.label || "Menu" });
      let input = null;
      if (opt.search) {
        const s = el("div", "eui-pop-search");
        input = el("input", "", { type: "text", placeholder: "Filter...", "aria-label": "Filter options", autocomplete: "off" });
        s.append(icon("search"), input);
        node.append(s);
      }
      if (opt.title) node.append(el("div", "eui-menu-head", { text: opt.title }));
      const list = el("div", "eui-pop-list");
      node.append(list);
      let shown = [], activeIdx = -1;
      function setActive(i) {
        activeIdx = i;
        shown.forEach((b, j) => b.classList.toggle("is-active", j === i));
        if (shown[i]) scrollIntoContainer(list, shown[i]);
      }
      function run(it, b) {
        if (opt.multi) {
          it.selected = !it.selected;
          b.setAttribute("aria-selected", String(!!it.selected));
          safeCall(it.action);
        } else {
          closePopover();
          safeCall(it.action);
        }
      }
      function render() {
        list.textContent = "";
        shown = [];
        const q = input ? input.value.trim().toLowerCase() : "";
        let sel = -1;
        items.forEach((it) => {
          if (it.separator) { if (!q) list.append(el("div", "eui-menu-sep")); return; }
          if (q && it.label.toLowerCase().indexOf(q) === -1) return;
          const b = el("button", "eui-menu-item" + (it.danger ? " is-danger" : ""), {
            type: "button",
            role: opt.multi ? "option" : opt.select ? "option" : "menuitem",
            "aria-selected": opt.select || opt.multi ? String(!!it.selected) : null
          });
          if (opt.multi) { const box = el("span", "eui-box"); box.append(icon("check")); b.append(box); }
          else if (it.icon) b.append(icon(it.icon));
          b.append(el("span", "eui-menu-label", { text: it.label }));
          if (it.kbd) b.append(el("span", "eui-kbd", { text: it.kbd }));
          if (opt.select && !opt.multi) { const c = icon("check"); c.classList.add("eui-check"); b.append(c); }
          b.addEventListener("click", () => run(it, b));
          b.addEventListener("pointermove", () => { const i = shown.indexOf(b); if (i !== activeIdx) setActive(i); });
          if (it.selected && sel === -1) sel = shown.length;
          list.append(b);
          shown.push(b);
        });
        if (!shown.length) list.append(el("div", "eui-menu-empty", { text: q ? 'Nothing matches "' + input.value.trim() + '".' : "No options yet." }));
        setActive(shown.length ? Math.max(0, sel) : -1);
      }
      node.addEventListener("keydown", (e) => {
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault();
          if (!shown.length) return;
          const d = e.key === "ArrowDown" ? 1 : -1;
          setActive((activeIdx + d + shown.length) % shown.length);
          if (!input) shown[activeIdx].focus({ preventScroll: true });
        } else if (e.key === "Enter" && shown[activeIdx] && (input === document.activeElement)) {
          e.preventDefault();
          shown[activeIdx].click();
        }
      });
      if (input) input.addEventListener("input", render);
      render();
      openPopover(anchor, node, opt);
      const f = input || shown[activeIdx] || node;
      f.focus({ preventScroll: true });
      return node;
    }

    function openColorPicker(anchor, start, onPick) {
      let hsv = rgbToHsv(parseColor(start) || { r: 139, g: 92, b: 246 });
      const node = el("div", "eui-cp", { role: "dialog", "aria-label": "Color picker" });
      const sv = el("div", "eui-cp-sv", { role: "slider", tabindex: "0", "aria-label": "Saturation and brightness" });
      const svDot = el("i", "eui-cp-dot");
      sv.append(svDot);
      const hue = el("div", "eui-cp-hue", { role: "slider", tabindex: "0", "aria-label": "Hue", "aria-valuemin": "0", "aria-valuemax": "360" });
      const hueDot = el("i", "eui-cp-dot");
      hue.append(hueDot);
      const sw = el("div", "eui-cp-swatches");
      const swBtns = SWATCHES.map((c) => {
        const b = el("button", "eui-cp-sw", { type: "button", "aria-label": c, "aria-pressed": "false" });
        b.style.background = c;
        b.addEventListener("click", () => { hsv = rgbToHsv(parseColor(c)); update(true); });
        sw.append(b);
        return b;
      });
      const row = el("div", "eui-cp-row");
      const preview = el("div", "eui-cp-preview");
      const hex = el("input", "eui-input is-mono", { type: "text", "aria-label": "Hex color", maxlength: "7", spellcheck: "false" });
      row.append(preview, hex);
      node.append(sv, hue, sw, row);
      function update(fire) {
        const c = rgbToHex(hsvToRgb(hsv.h, hsv.s, hsv.v));
        sv.style.setProperty("--h", Math.round(hsv.h));
        svDot.style.left = hsv.s * 100 + "%";
        svDot.style.top = (1 - hsv.v) * 100 + "%";
        svDot.style.background = c;
        hueDot.style.left = (hsv.h / 360) * 100 + "%";
        hueDot.style.background = "hsl(" + Math.round(hsv.h) + " 100% 50%)";
        hue.setAttribute("aria-valuenow", String(Math.round(hsv.h)));
        preview.style.background = c;
        if (document.activeElement !== hex) hex.value = c.toUpperCase();
        swBtns.forEach((b, i) => b.setAttribute("aria-pressed", String(SWATCHES[i] === c)));
        if (fire) onPick(c);
      }
      function dragArea(area, fn) {
        area.addEventListener("pointerdown", (e) => { area.setPointerCapture(e.pointerId); fn(e); });
        area.addEventListener("pointermove", (e) => { if (area.hasPointerCapture(e.pointerId)) fn(e); });
      }
      dragArea(sv, (e) => {
        const r = sv.getBoundingClientRect();
        hsv.s = clamp((e.clientX - r.left) / r.width, 0, 1);
        hsv.v = 1 - clamp((e.clientY - r.top) / r.height, 0, 1);
        update(true);
      });
      dragArea(hue, (e) => {
        const r = hue.getBoundingClientRect();
        hsv.h = clamp((e.clientX - r.left) / r.width, 0, 1) * 359.9;
        update(true);
      });
      sv.addEventListener("keydown", (e) => {
        const d = { ArrowRight: [0.02, 0], ArrowLeft: [-0.02, 0], ArrowUp: [0, 0.02], ArrowDown: [0, -0.02] }[e.key];
        if (d) { e.preventDefault(); hsv.s = clamp(hsv.s + d[0], 0, 1); hsv.v = clamp(hsv.v + d[1], 0, 1); update(true); }
      });
      hue.addEventListener("keydown", (e) => {
        const d = { ArrowRight: 4, ArrowUp: 4, ArrowLeft: -4, ArrowDown: -4 }[e.key];
        if (d) { e.preventDefault(); hsv.h = (hsv.h + d + 360) % 360; update(true); }
      });
      hex.addEventListener("input", () => {
        const c = parseColor(hex.value);
        if (c && /^#?[0-9a-f]{6}$/i.test(hex.value.trim())) { hsv = rgbToHsv(c); update(true); }
      });
      update(false);
      openPopover(anchor, node, {});
      sv.focus({ preventScroll: true });
    }

    // ─────────────────────────────────────────── overlays (dialog, search)
    const overlays = [];
    function pushOverlay(ov, onClose) {
      const entry = { ov, closed: false };
      entry.close = function () {
        if (entry.closed) return;
        entry.closed = true;
        overlays.splice(overlays.indexOf(entry), 1);
        ov.classList.add("is-leaving");
        setTimeout(() => ov.remove(), 160);
        safeCall(onClose);
      };
      overlays.push(entry);
      return entry;
    }
    function closeOverlays() { overlays.slice().forEach((o) => o.close()); }

    W.Dialog = function (o) {
      o = o || {};
      closePopover();
      const ov = el("div", "eui-overlay");
      const d = el("div", "eui-sheet eui-dialog", { role: "alertdialog", "aria-modal": "true", "aria-label": o.Title || "Dialog" });
      d.append(el("h3", "", { text: o.Title || "" }));
      if (o.Content) d.append(el("p", "", { text: o.Content }));
      if (o.Code) d.append(el("div", "eui-code", { text: o.Code }));
      const acts = el("div", "eui-dialog-actions");
      const buttons = o.Buttons && o.Buttons.length ? o.Buttons : [{ Name: "OK", Style: "Primary" }];
      const entry = pushOverlay(ov);
      let last = null;
      buttons.forEach((b) => {
        const style = b.Style === "Primary" ? "" : b.Style === "Danger" ? " is-danger" : " is-ghost";
        const btn = el("button", "eui-btn" + style, { type: "button", text: b.Name });
        btn.addEventListener("click", () => { entry.close(); safeCall(b.Callback); });
        acts.append(btn);
        last = btn;
      });
      d.append(acts);
      ov.append(d);
      ov.addEventListener("pointerdown", (e) => { if (e.target === ov && o.Dismissible !== false) entry.close(); });
      root.append(ov);
      if (last) last.focus({ preventScroll: true });
      return { Close: entry.close };
    };
    function confirmDialog(title, content, action, fn) {
      W.Dialog({ Title: title, Content: content, Buttons: [{ Name: "Cancel" }, { Name: action, Style: "Danger", Callback: fn }] });
    }

    let paletteOpen = null;
    function openPalette() {
      if (!Config.Search) return;
      if (!visible) W.Show();
      if (minimized) W.Minimize(false);
      if (paletteOpen) { paletteOpen.focus(); return; }
      closePopover();
      const ov = el("div", "eui-overlay");
      const sheet = el("div", "eui-sheet eui-palette", { role: "dialog", "aria-modal": "true", "aria-label": "Search" });
      const bar = el("div", "eui-palette-input");
      const input = el("input", "", { type: "text", placeholder: "Search settings, tabs and actions", "aria-label": "Search", autocomplete: "off", spellcheck: "false" });
      bar.append(icon("search"), input, el("span", "eui-kbd", { text: "Esc" }));
      const list = el("div", "eui-palette-list", { role: "listbox", "aria-label": "Results" });
      const foot = el("div", "eui-palette-foot");
      [["↑↓", "Move"], ["↵", "Open"], [MOD + " ↵", "Toggle in place"], ["Esc", "Close"]].forEach(([k, t]) => {
        const s = el("span");
        s.append(el("span", "eui-kbd", { text: k }), document.createTextNode(t));
        foot.append(s);
      });
      sheet.append(bar, list, foot);
      ov.append(sheet);
      root.append(ov);
      const entry = pushOverlay(ov, () => { paletteOpen = null; });
      paletteOpen = input;
      ov.addEventListener("pointerdown", (e) => { if (e.target === ov) entry.close(); });

      let results = [], idx = 0, nodes = [];
      const ORDER = { Tabs: 0, Settings: 1, Actions: 2 };
      function entries() {
        const out = [];
        W.Tabs.forEach((t) => out.push({ group: "Tabs", name: t.Name, path: t._desc || "Open tab", icon: t._icon || "folder", run: () => goTab(t) }));
        controls.forEach((c) => {
          const v = c.display ? c.display() : "";
          out.push({ group: "Settings", name: c.name, path: c.path(), icon: c.tab._icon || "sliders", value: v, isOn: v === "On", run: () => jumpTo(c), act: c.activate ? () => c.activate() : null });
        });
        out.push({ group: "Actions", name: "Open settings", path: "Look, layout, privacy and configs", icon: "settings", run: () => goTab(settingsTab) });
        LAYOUTS.forEach((l) => out.push({ group: "Actions", name: "Layout: " + l, path: l === state.layout ? "Current layout" : "Switch layout", icon: "grid", run: () => setLayout(l, true) }));
        out.push({ group: "Actions", name: state.streamer ? "Turn off streamer mode" : "Turn on streamer mode", path: "Privacy", icon: "radio", run: () => flagSet("EliteUI_StreamerMode", !state.streamer) });
        Object.keys(PALETTES).forEach((n) => out.push({ group: "Actions", name: "Palette: " + n, path: "Change colors", icon: "palette", run: () => applyPalette(n) }));
        return out;
      }
      function score(e, toks) {
        const nm = e.name.toLowerCase(), hay = nm + " " + String(e.path).toLowerCase();
        let s = 0;
        for (const t of toks) {
          if (hay.indexOf(t) === -1) return -1;
          s += nm.indexOf(t) === 0 ? 3 : nm.indexOf(t) > -1 ? 2 : 1;
        }
        return s;
      }
      function highlight(name, toks) {
        const frag = document.createDocumentFragment();
        const t = toks.slice().sort((a, b) => b.length - a.length)[0];
        const i = t ? name.toLowerCase().indexOf(t) : -1;
        if (i < 0) { frag.append(name); return frag; }
        frag.append(name.slice(0, i));
        frag.append(el("mark", "", { text: name.slice(i, i + t.length) }));
        frag.append(name.slice(i + t.length));
        return frag;
      }
      function paintActive() {
        nodes.forEach((n, i) => { n.classList.toggle("is-active", i === idx); n.setAttribute("aria-selected", String(i === idx)); });
        if (nodes[idx]) scrollIntoContainer(list, nodes[idx]);
      }
      function render(keepIdx) {
        const raw = input.value.trim();
        const toks = raw.toLowerCase().split(/\s+/).filter(Boolean);
        const all = entries();
        if (!toks.length) results = all.filter((e) => e.group === "Tabs" || (e.group === "Actions" && e.name.indexOf("Palette:") !== 0));
        else {
          results = all.map((e) => [e, score(e, toks)]).filter((x) => x[1] >= 0)
            .sort((a, b) => ORDER[a[0].group] - ORDER[b[0].group] || b[1] - a[1]).map((x) => x[0]).slice(0, 60);
        }
        list.textContent = "";
        nodes = [];
        let group = null;
        results.forEach((r, i) => {
          if (r.group !== group) { group = r.group; list.append(el("div", "eui-palette-group", { text: group })); }
          const b = el("button", "eui-palette-item", { type: "button", role: "option" });
          const ic = el("span", "eui-palette-icon");
          ic.append(icon(r.icon) || icon("sliders"));
          const txt = el("span");
          const nm = el("span", "eui-palette-name");
          nm.append(highlight(r.name, toks));
          txt.append(nm, el("span", "eui-palette-path", { text: r.path }));
          b.append(ic, txt);
          if (r.value) b.append(el("span", "eui-palette-value" + (r.isOn ? " is-on" : ""), { text: r.value }));
          b.addEventListener("click", () => { entry.close(); r.run(); });
          b.addEventListener("pointermove", () => { if (idx !== i) { idx = i; paintActive(); } });
          list.append(b);
          nodes.push(b);
        });
        if (!results.length) list.append(el("div", "eui-palette-empty", { text: 'Nothing matches "' + raw + '". Try a tab name, a setting, or "palette".' }));
        idx = keepIdx != null ? Math.min(keepIdx, results.length - 1) : 0;
        paintActive();
      }
      input.addEventListener("input", () => render());
      input.addEventListener("keydown", (e) => {
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault();
          if (!results.length) return;
          idx = (idx + (e.key === "ArrowDown" ? 1 : -1) + results.length) % results.length;
          paintActive();
        } else if (e.key === "Enter" && results[idx]) {
          e.preventDefault();
          const r = results[idx];
          if ((e.ctrlKey || e.metaKey) && r.act) { r.act(); render(idx); }
          else { entry.close(); r.run(); }
        }
      });
      render();
      input.focus({ preventScroll: true });
    }
    W.OpenSearch = openPalette;

    // ────────────────────────────────────────────────── notifications
    W.Notify = function (o) {
      o = o || {};
      if (!state.notifications && !o.Force) return null;
      const type = String(o.Type || "info").toLowerCase();
      const t = el("div", "eui-toast", { role: type === "error" ? "alert" : "status", "data-type": type });
      const ic = el("div", "eui-toast-icon");
      ic.append(icon(o.Icon || o.Image) || icon(TYPE_ICON[type]) || icon("bell"));
      const bodyEl = el("div");
      bodyEl.append(el("div", "eui-toast-title", { text: o.Title || "Notification" }));
      if (o.Content) bodyEl.append(el("div", "eui-toast-text", { text: o.Content }));
      const x = el("button", "eui-toast-close", { type: "button", "aria-label": "Dismiss" });
      x.append(icon("x"));
      const timer = el("div", "eui-toast-timer");
      timer.style.setProperty("--d", (o.Duration || 4) + "s");
      let gone = false;
      const dismiss = () => {
        if (gone) return;
        gone = true;
        t.classList.add("is-leaving");
        setTimeout(() => t.remove(), 280);
      };
      if (o.Actions && o.Actions.length) {
        const acts = el("div", "eui-toast-actions");
        o.Actions.forEach((a) => {
          const b = el("button", "", { type: "button", text: a.Name });
          b.addEventListener("click", () => { dismiss(); safeCall(a.Callback); });
          acts.append(b);
        });
        bodyEl.append(acts);
      }
      t.append(ic, bodyEl, x, timer);
      toasts.append(t);
      while (toasts.children.length > 4) toasts.firstChild.remove();
      timer.addEventListener("animationend", dismiss);
      x.addEventListener("click", dismiss);
      return { Dismiss: dismiss };
    };

    // ─────────────────────────────────────────────────────────── tabs
    let activeTab = null, settingsTab = null, settingsPanelOpen = false, pillPlaced = false, zTop = 1;
    const controls = [], byId = {};
    function movePill() {
      const btn = activeTab && activeTab._button;
      if (!btn || state.layout === "Panels" || !btn.offsetWidth) { pill.classList.remove("is-on"); return; }
      if (!pillPlaced) pill.style.transition = "none";
      if (state.layout === "Tabs") {
        pill.style.width = btn.offsetWidth + "px";
        pill.style.height = btn.offsetHeight + "px";
        pill.style.transform = "translate(" + btn.offsetLeft + "px, " + btn.offsetTop + "px)";
      } else {
        pill.style.width = "";
        pill.style.height = btn.offsetHeight + "px";
        pill.style.transform = "translateY(" + btn.offsetTop + "px)";
      }
      if (!pillPlaced) { void pill.offsetWidth; pill.style.transition = ""; pillPlaced = true; }
      pill.classList.add("is-on");
    }
    function updatePages() {
      const panelsMode = state.layout === "Panels";
      W.Tabs.forEach((t) => { t._page.hidden = panelsMode ? (t === settingsTab && !settingsPanelOpen) : t !== activeTab; });
      dockSettings.classList.toggle("is-on", settingsPanelOpen);
    }
    function selectTab(tab) {
      if (!tab) return;
      const changed = tab !== activeTab;
      activeTab = tab;
      W.Tabs.forEach((t) => {
        if (!t._button) return;
        t._button.classList.toggle("is-active", t === tab);
        if (t === tab) t._button.setAttribute("aria-current", "page"); else t._button.removeAttribute("aria-current");
      });
      profile.classList.toggle("is-active", tab === settingsTab);
      updatePages();
      if (changed && state.layout !== "Panels") {
        tab._page.classList.remove("is-entering");
        void tab._page.offsetWidth;
        tab._page.classList.add("is-entering");
        clearTimeout(tab._enterT);
        tab._enterT = setTimeout(() => tab._page.classList.remove("is-entering"), 700);
      }
      requestAnimationFrame(relayout);
    }
    function frontPanel(tab) { tab._page.style.zIndex = String(++zTop); }
    function goTab(tab) {
      if (!visible) W.Show();
      if (state.layout === "Panels") {
        if (tab === settingsTab) { settingsPanelOpen = true; updatePages(); }
        if (tab._page.classList.contains("is-collapsed")) setCollapsed(tab, false);
        frontPanel(tab);
        activeTab = tab;
        if (compact) panels.scrollTo({ left: tab._page.offsetLeft - (panels.clientWidth - tab._page.offsetWidth) / 2, behavior: "smooth" });
        tab._page.classList.remove("is-flash");
        void tab._page.offsetWidth;
        tab._page.classList.add("is-flash");
        requestAnimationFrame(relayout);
      } else selectTab(tab);
    }
    function jumpTo(c) {
      c.reveal.forEach((fn) => fn());
      goTab(c.tab);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollIntoContainer(c.tab._scroll, c.row, true);
          c.row.classList.remove("is-flash");
          void c.row.offsetWidth;
          c.row.classList.add("is-flash");
        });
      });
    }
    W.SelectTab = function (name) { const t = W.Tabs.find((x) => x.Name === name); if (t) goTab(t); };
    profile.addEventListener("click", () => goTab(settingsTab));
    gearBtn.addEventListener("click", () => goTab(settingsTab));
    dockSettings.addEventListener("click", () => {
      settingsPanelOpen = !settingsPanelOpen;
      updatePages();
      if (settingsPanelOpen) goTab(settingsTab);
    });
    dockLayout.addEventListener("click", (e) => {
      openMenu(dockLayout, LAYOUTS.map((l) => ({ label: l, selected: l === state.layout, action: () => setLayout(l, true) })), { select: true, label: "Layout", title: "Layout" });
      e.stopPropagation();
    });

    // Panels layout: per-tab position + collapsed state
    let panelState = pref("EliteUI_Panels", {}) || {};
    function savePanels() { W.SaveSettings("EliteUI_Panels", panelState); }
    function setCollapsed(tab, c) {
      tab._page.classList.toggle("is-collapsed", c);
      tab._collapseBtn.setAttribute("aria-expanded", String(!c));
      panelState[tab.Name] = Object.assign({}, panelState[tab.Name], { c });
      savePanels();
    }
    function placePanels() {
      const rw = root.clientWidth, rh = root.clientHeight;
      const PW = 244, GAP = 12, TOP = 74;
      let x = 16, y = TOP;
      W.Tabs.forEach((t) => {
        const s = panelState[t.Name] || {};
        let px, py;
        if (t === settingsTab && s.x == null) { px = rw - PW - 16; py = TOP; }
        else if (s.x != null) { px = s.x; py = s.y; }
        else {
          if (x + PW > rw - 16 && x > 16) { x = 16; y += 46; }
          px = x; py = y;
          x += PW + GAP;
        }
        px = clamp(px, 0, rw - 80);
        py = clamp(py, 0, rh - 50);
        t._page.style.setProperty("--px", px + "px");
        t._page.style.setProperty("--py", py + "px");
        t._page.classList.toggle("is-collapsed", !!s.c);
        if (t._collapseBtn) t._collapseBtn.setAttribute("aria-expanded", String(!s.c));
      });
    }
    function setLayout(name, save) {
      name = normLayout(name);
      state.layout = name;
      LAYOUTS.forEach((l) => root.classList.toggle("eui--layout-" + l.toLowerCase(), l === name));
      const panelsMode = name === "Panels";
      W.Tabs.forEach((t) => {
        const target = panelsMode ? panels : main;
        if (t._page.parentNode !== target) target.append(t._page);
        t._page.style.zIndex = "";
      });
      if (panelsMode) placePanels();
      if (minimized && panelsMode) W.Minimize(false);
      pillPlaced = false;
      updatePages();
      applyVisibility();
      requestAnimationFrame(relayout);
      if (save) {
        W.SaveSettings("EliteUI_Layout", name);
        if (layoutCtl) layoutCtl._sync(name);
      }
    }
    W.SetLayout = (name) => setLayout(name, true);
    W.GetLayout = () => state.layout;

    function createTab(name, iconName, desc, hidden) {
      const page = el("div", "eui-page", { role: "region", "aria-label": name });
      page.hidden = true;
      const head = el("header", "eui-page-head");
      const pi = el("div", "eui-page-icon");
      pi.append(icon(iconName) || icon("folder"));
      const titles = el("div", "eui-page-titles");
      titles.append(el("h2", "eui-page-title", { text: name }));
      const descEl = el("p", "eui-page-desc", { text: desc || "" });
      if (!desc) descEl.hidden = true;
      titles.append(descEl);
      const collapse = el("button", "eui-icon-btn eui-panel-toggle", { type: "button", "aria-label": "Collapse " + name, "aria-expanded": "true" });
      collapse.append(icon("chevron"));
      head.append(pi, titles, collapse);
      const scroll = el("div", "eui-scroll");
      page.append(head, scroll);
      main.append(page);
      const ctx = { reveal: [] };
      const Tab = makeContainer(scroll, ctx);
      ctx.tab = Tab;
      Object.assign(Tab, { Name: name, _icon: iconName, _desc: desc, _page: page, _scroll: scroll, _collapseBtn: collapse });
      collapse.addEventListener("click", () => setCollapsed(Tab, !page.classList.contains("is-collapsed")));
      page.addEventListener("pointerdown", () => { if (state.layout === "Panels") frontPanel(Tab); });
      draggable(head, {
        canStart: () => state.layout === "Panels" && !compact,
        begin(s) {
          s.x0 = parseFloat(page.style.getPropertyValue("--px")) || 0;
          s.y0 = parseFloat(page.style.getPropertyValue("--py")) || 0;
          frontPanel(Tab);
        },
        move(dx, dy, s) {
          const x = clamp(s.x0 + dx, 0, root.clientWidth - page.offsetWidth);
          const y = clamp(s.y0 + dy, 0, root.clientHeight - 44);
          page.style.setProperty("--px", x + "px");
          page.style.setProperty("--py", y + "px");
          s.nx = x; s.ny = y;
        },
        end(s) {
          panelState[name] = Object.assign({}, panelState[name], { x: s.nx, y: s.ny });
          savePanels();
        }
      });
      if (!hidden) {
        const btn = el("button", "eui-nav-item", { type: "button", title: name });
        const ic = icon(iconName);
        if (ic) btn.append(ic);
        btn.append(el("span", "eui-nav-label", { text: name }));
        btn.addEventListener("click", () => selectTab(Tab));
        nav.append(btn);
        Tab._button = btn;
      }
      Tab.Select = () => goTab(Tab);
      Tab.SetBadge = function (text) {
        if (!Tab._button) return;
        let b = Tab._button.querySelector(".eui-badge");
        if (text == null || text === "") { if (b) b.remove(); return; }
        if (!b) { b = el("span", "eui-badge"); Tab._button.append(b); }
        b.textContent = String(text);
      };
      Tab.SetDescription = function (t) { Tab._desc = t; descEl.textContent = t || ""; descEl.hidden = !t; };
      W.Tabs.push(Tab);
      if (state.layout === "Panels") { panels.append(page); placePanels(); }
      if (!hidden && (!activeTab || activeTab === settingsTab)) selectTab(Tab);
      else updatePages();
      return Tab;
    }
    W.CreateTab = function (name, iconName, desc) {
      if (name && typeof name === "object") return createTab(name.Name, name.Icon, name.Description, false);
      return createTab(name, iconName, desc, false);
    };

    // ─────────────────────────────────────────── binds + context menu
    let binds = pref("EliteUI_Binds", {}) || {};
    let capture = null;
    const keybindHolds = [];
    function paintBind(c) {
      if (!c.bindEl) return;
      const code = binds[c.id];
      c.bindEl.hidden = !code && !c.listening;
      c.bindEl.textContent = c.listening ? "..." : keyLabel(code);
      c.bindEl.classList.toggle("is-listening", !!c.listening);
    }
    function startBind(c) {
      c.listening = true;
      paintBind(c);
      W.Notify({ Title: "Press a key", Content: "Binding " + c.name + ". Esc cancels, Backspace clears.", Duration: 3, Icon: "keyboard" });
      capture = (e) => {
        c.listening = false;
        if (e.code === "Backspace" || e.code === "Delete") delete binds[c.id];
        else if (e.code !== "Escape") {
          if (e.code === Config.ToggleKey) {
            W.Notify({ Title: "Key already in use", Content: keyLabel(e.code) + " opens EliteUI. Pick a different key.", Type: "warning" });
          } else binds[c.id] = e.code;
        }
        W.SaveSettings("EliteUI_Binds", binds);
        paintBind(c);
      };
    }
    function openRowMenu(c, point) {
      const items = [];
      if (c.reset) items.push({ label: "Reset to default", icon: "rotate", action: c.reset });
      if (c.copyText) items.push({ label: "Copy value", icon: "copy", action: () => copyText(c.copyText(), c.name) });
      if (c.bindable) {
        if (items.length) items.push({ separator: true });
        const code = binds[c.id];
        items.push({ label: code ? "Change key bind" : "Bind to a key", icon: "keyboard", kbd: code ? keyLabel(code) : null, action: () => startBind(c) });
        if (code) items.push({ label: "Remove key bind", icon: "x", danger: true, action: () => { delete binds[c.id]; W.SaveSettings("EliteUI_Binds", binds); paintBind(c); } });
      }
      if (c.module) {
        items.push({ separator: true });
        items.push({ label: c.module.isOpen() ? "Hide settings" : "Show settings", icon: "sliders", action: () => c.module.expand(!c.module.isOpen()) });
      }
      if (!items.length) return;
      openMenu(null, items, { point, label: c.name, title: c.name });
    }
    function attachRowMenu(c) {
      const row = c.row;
      row.addEventListener("contextmenu", (e) => { e.preventDefault(); openRowMenu(c, { x: e.clientX, y: e.clientY }); });
      let t = null, start = null;
      row.addEventListener("touchstart", (e) => {
        const p = e.touches[0];
        start = { x: p.clientX, y: p.clientY };
        t = setTimeout(() => { row._longPressed = true; openRowMenu(c, start); }, 550);
      }, { passive: true });
      row.addEventListener("touchmove", (e) => {
        const p = e.touches[0];
        if (start && Math.hypot(p.clientX - start.x, p.clientY - start.y) > 8) clearTimeout(t);
      }, { passive: true });
      row.addEventListener("touchend", () => clearTimeout(t));
      row.addEventListener("click", (e) => { if (row._longPressed) { row._longPressed = false; e.stopImmediatePropagation(); e.preventDefault(); } }, true);
    }
    function copyText(text, what) {
      const ok = () => W.Notify({ Title: "Copied", Content: what ? what + ": " + text : "Copied to clipboard.", Type: "success", Duration: 2 });
      const fail = () => W.Dialog({ Title: "Copy this text", Content: "Your browser blocked the clipboard. Select the text below and copy it.", Code: text });
      try { navigator.clipboard.writeText(String(text)).then(ok, fail); } catch (e) { fail(); }
    }

    // ───────────────────────────────────────────────── active-list HUD
    const hudItems = new Map();
    function refreshHud() {
      wm.hidden = !state.watermark;
      activeHud.hidden = !state.activeList;
      const on = controls.filter((c) => (c.type === "toggle" || c.type === "module") && c.hud && c.get());
      const ids = new Set(on.map((c) => c.id));
      hudItems.forEach((node, id) => {
        if (!ids.has(id)) {
          hudItems.delete(id);
          node.classList.add("is-leaving");
          setTimeout(() => node.remove(), 220);
        }
      });
      on.sort((a, b) => b.name.length - a.name.length).forEach((c) => {
        let node = hudItems.get(c.id);
        if (!node) {
          node = el("div", "eui-active-item eui-glass-chip");
          node.append(el("i"), el("span", "", { text: c.name }));
          hudItems.set(c.id, node);
        }
        activeHud.append(node);
      });
    }
    W.SetWatermark = (v) => flagSet("EliteUI_Watermark", !!v);
    W.SetActiveList = (v) => flagSet("EliteUI_ActiveList", !!v);

    // ─────────────────────────────────────────────── container + components
    function register(c) {
      controls.push(c);
      if (c.id) byId[c.id] = c;
      if (c.flag) W.Flags[c.flag] = c.api;
      attachRowMenu(c);
      return c;
    }
    function textBlock(o) {
      const wrap = el("div", "eui-text");
      const label = el("div", "eui-label");
      label.append(el("span", "", { text: o.Name || "" }));
      const bind = el("span", "eui-kbd eui-bind");
      bind.hidden = true;
      label.append(bind);
      wrap.append(label);
      if (o.Description) wrap.append(el("div", "eui-desc", { text: o.Description }));
      return { wrap, label, bind };
    }
    function makeSeg(names, current, onSelect, opt) {
      opt = opt || {};
      const seg = el("div", "eui-seg" + (opt.tabs ? " is-tabs" : ""), { role: opt.tabs ? "tablist" : "radiogroup", "aria-label": opt.label || null });
      const thumb = el("div", "eui-seg-thumb", { "aria-hidden": "true" });
      seg.append(thumb);
      let value = current, placed = false;
      const btns = names.map((n) => {
        const b = el("button", "eui-seg-btn", { type: "button", role: opt.tabs ? "tab" : "radio", text: n });
        b.addEventListener("click", (e) => { e.stopPropagation(); api.select(n, true); });
        seg.append(b);
        return b;
      });
      seg.addEventListener("keydown", (e) => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        e.preventDefault();
        const i = names.indexOf(value) + (e.key === "ArrowRight" ? 1 : -1);
        const n = names[(i + names.length) % names.length];
        api.select(n, true);
        btns[names.indexOf(n)].focus({ preventScroll: true });
      });
      const api = {
        el: seg,
        get: () => value,
        layout() {
          const b = btns[names.indexOf(value)];
          if (!b || !b.offsetWidth) return;
          if (!placed) thumb.style.transition = "none";
          thumb.style.width = b.offsetWidth + "px";
          thumb.style.transform = "translateX(" + b.offsetLeft + "px)";
          if (!placed) { void thumb.offsetWidth; thumb.style.transition = ""; placed = true; }
        },
        select(n, fire) {
          if (names.indexOf(n) === -1) return;
          value = n;
          btns.forEach((b, i) => {
            b.setAttribute(opt.tabs ? "aria-selected" : "aria-checked", String(names[i] === n));
            b.tabIndex = names[i] === n ? 0 : -1;
          });
          api.layout();
          if (fire) safeCall(onSelect, n);
        }
      };
      segs.add(api);
      api.select(current, false);
      return api;
    }

    function makeContainer(host, ctx, flat) {
      let group = null, sectionName = "";
      const api = {};
      function target() {
        if (flat) return host;
        if (!group) {
          const block = el("div", "eui-block");
          group = el("div", "eui-group");
          block.append(group);
          host.append(block);
        }
        return group;
      }
      function path() {
        const parts = [ctx.tab.Name].concat(ctx.trail || []);
        if (sectionName) parts.push(sectionName);
        return parts.join(" › ");
      }
      function entry(base) {
        const p = path();
        return Object.assign({ tab: ctx.tab, reveal: ctx.reveal.slice(), path: () => p, hud: false }, base);
      }
      function flagKey(o) { return o.Flag || o.Name; }

      api.CreateSection = function (name, iconName) {
        sectionName = name || "";
        const label = el("div", "eui-section");
        const ic = icon(iconName);
        if (ic) label.append(ic);
        const txt = el("span", "", { text: name });
        label.append(txt);
        if (flat) { host.append(label); }
        else {
          const block = el("div", "eui-block");
          group = el("div", "eui-group");
          block.append(label, group);
          host.append(block);
        }
        return { SetText: (t) => { txt.textContent = t; } };
      };

      api.CreateButton = function (o) {
        o = o || {};
        let row, labelSpan;
        const fire = () => {
          row.classList.remove("is-pressed");
          void row.offsetWidth;
          row.classList.add("is-pressed");
          setTimeout(() => row.classList.remove("is-pressed"), 220);
          safeCall(o.Callback);
        };
        const t = textBlock(o);
        if (o.Style === "Primary") {
          row = el("div", "eui-row is-btn");
          const btn = el("button", "eui-btn", { type: "button" });
          if (o.Icon) btn.append(icon(o.Icon));
          labelSpan = el("span", "", { text: o.Name });
          btn.append(labelSpan);
          btn.addEventListener("click", fire);
          row.append(btn);
        } else {
          row = el("div", "eui-row is-click is-action" + (o.Style === "Danger" ? " is-danger" : ""), { role: "button", tabindex: "0" });
          labelSpan = t.label.firstChild;
          const go = el("span", "eui-go", { "aria-hidden": "true" });
          go.append(icon(o.Icon || "chevron-right"));
          row.append(t.wrap, go);
          row.addEventListener("click", fire);
          row.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fire(); } });
        }
        target().append(row);
        const ctl = { SetText: (s) => { labelSpan.textContent = s; }, Fire: fire, Instance: row };
        register(entry({ id: "button:" + ctx.tab.Name + "/" + o.Name, name: o.Name, type: "button", row, bindEl: o.Style === "Primary" ? null : t.bind, bindable: true, activate: fire, display: () => "", api: ctl }));
        paintBind(byId["button:" + ctx.tab.Name + "/" + o.Name]);
        return ctl;
      };

      function toggleImpl(o, isModule) {
        const key = flagKey(o);
        let value = !!pref(key, o.CurrentValue);
        const def = !!o.CurrentValue;
        const row = el("div", "eui-row is-click is-toggle");
        const t = textBlock(o);
        const sw = el("button", "eui-switch", { type: "button", role: "switch", "aria-label": o.Name });
        row.append(t.wrap);
        let expandBtn = null;
        if (isModule) {
          expandBtn = el("button", "eui-expand", { type: "button", "aria-label": "Settings for " + o.Name, "aria-expanded": "false" });
          expandBtn.append(icon("chevron"));
          row.append(expandBtn);
        }
        row.append(sw);
        target().append(row);
        const c = entry({ id: key, flag: key, name: o.Name, type: isModule ? "module" : "toggle", row, bindEl: t.bind, bindable: true, hud: o.HUD !== false && String(key).indexOf("EliteUI_") !== 0 });
        function set(v, fire, save) {
          value = !!v;
          sw.setAttribute("aria-checked", String(value));
          row.dataset.on = String(value);
          if (save !== false) W.SaveSettings(key, value);
          refreshHud();
          if (fire) safeCall(o.Callback, value);
        }
        row.addEventListener("click", (e) => { if (!e.target.closest(".eui-expand")) set(!value, true); });
        const ctl = {
          SetValue: (v) => set(v, true),
          GetValue: () => value,
          SetDisabled: (d) => row.classList.toggle("is-disabled", !!d)
        };
        Object.assign(c, {
          api: ctl,
          get: () => value,
          display: () => (value ? "On" : "Off"),
          activate: () => {
            set(!value, true);
            W.Notify({ Title: o.Name, Content: value ? "Turned on" : "Turned off", Duration: 1.6, Icon: "keyboard", Type: value ? "success" : "info" });
          },
          reset: () => set(def, true),
          copyText: () => String(value)
        });
        ctl._load = ctl.SetValue;
        set(value, false, false);
        return { ctl, c, row, expandBtn };
      }

      api.CreateToggle = function (o) {
        const r = toggleImpl(o || {}, false);
        register(r.c);
        paintBind(r.c);
        return r.ctl;
      };

      api.CreateModule = function (o) {
        o = o || {};
        const r = toggleImpl(o, true);
        const nest = el("div", "eui-nest");
        target().append(nest);
        let open = false;
        const expand = (v) => {
          open = !!v;
          nest.hidden = !open;
          r.expandBtn.setAttribute("aria-expanded", String(open));
          if (open) requestAnimationFrame(relayout);
        };
        expand(!!o.Expanded);
        r.expandBtn.addEventListener("click", (e) => { e.stopPropagation(); expand(!open); });
        r.c.module = { isOpen: () => open, expand };
        register(r.c);
        paintBind(r.c);
        const subCtx = { tab: ctx.tab, reveal: ctx.reveal.concat([() => expand(true)]), trail: (ctx.trail || []).concat(sectionName ? [sectionName, o.Name] : [o.Name]) };
        const sub = makeContainer(nest, subCtx, true);
        return Object.assign(sub, r.ctl, { Expand: expand, IsExpanded: () => open });
      };

      api.CreateSlider = function (o) {
        o = o || {};
        const key = flagKey(o);
        const min = o.Min != null ? o.Min : 0, max = o.Max != null ? o.Max : 100, step = o.Increment || 1;
        const def = o.CurrentValue != null ? o.CurrentValue : min;
        let value = null;
        const row = el("div", "eui-row is-col");
        const top = el("div", "eui-row-top");
        const t = textBlock(o);
        const val = el("button", "eui-value", { type: "button", title: "Type a value", "aria-label": o.Name + " value" });
        top.append(t.wrap, val);
        const track = el("div", "eui-track", { role: "slider", tabindex: "0", "aria-label": o.Name, "aria-valuemin": String(min), "aria-valuemax": String(max) });
        const fill = el("div", "eui-fill");
        const knob = el("div", "eui-knob");
        track.append(fill, knob);
        row.append(top, track);
        target().append(row);
        const fmt = (v) => fmtNum(v, step) + (o.Suffix ? (/^[%°×x]$/.test(o.Suffix) ? o.Suffix : " " + o.Suffix) : "");
        function set(v, fire, save) {
          v = Number(v);
          if (!isFinite(v)) return;
          v = clamp(Math.round((v - min) / step) * step + min, min, max);
          v = Number(v.toFixed((String(step).split(".")[1] || "").length));
          const changed = v !== value;
          value = v;
          const pct = max === min ? 0 : ((v - min) / (max - min)) * 100;
          fill.style.width = pct + "%";
          knob.style.left = pct + "%";
          val.textContent = fmt(v);
          track.setAttribute("aria-valuenow", String(v));
          track.setAttribute("aria-valuetext", fmt(v));
          if (save !== false) W.SaveSettings(key, v);
          if (fire && changed) safeCall(o.Callback, v);
        }
        set(pref(key, def), false, false);
        const fromPointer = (e) => {
          const r = track.getBoundingClientRect();
          set(min + clamp((e.clientX - r.left) / r.width, 0, 1) * (max - min), true);
        };
        track.addEventListener("pointerdown", (e) => { track.setPointerCapture(e.pointerId); track.classList.add("is-drag"); fromPointer(e); });
        track.addEventListener("pointermove", (e) => { if (track.hasPointerCapture(e.pointerId)) fromPointer(e); });
        const up = () => track.classList.remove("is-drag");
        track.addEventListener("pointerup", up);
        track.addEventListener("pointercancel", up);
        track.addEventListener("keydown", (e) => {
          const big = Math.max(step, (max - min) / 10);
          const d = { ArrowRight: step, ArrowUp: step, ArrowLeft: -step, ArrowDown: -step, PageUp: big, PageDown: -big }[e.key];
          if (d) { e.preventDefault(); set(value + d, true); }
          else if (e.key === "Home") { e.preventDefault(); set(min, true); }
          else if (e.key === "End") { e.preventDefault(); set(max, true); }
        });
        val.addEventListener("click", () => {
          const input = el("input", "eui-value", { type: "text", inputmode: "decimal", "aria-label": o.Name + " value" });
          input.value = String(value);
          val.replaceWith(input);
          input.focus();
          input.select();
          let done = false;
          const finish = (commit) => {
            if (done) return;
            done = true;
            if (commit) set(parseFloat(input.value), true);
            input.replaceWith(val);
          };
          input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") finish(true);
            else if (e.key === "Escape") { e.stopPropagation(); finish(false); }
          });
          input.addEventListener("blur", () => finish(true));
        });
        const ctl = { SetValue: (v) => set(v, true), GetValue: () => value };
        ctl._load = ctl.SetValue;
        register(entry({ id: key, flag: key, name: o.Name, type: "slider", row, api: ctl, display: () => fmt(value), reset: () => set(def, true), copyText: () => String(value) }));
        return ctl;
      };

      api.CreateDropdown = function (o) {
        o = o || {};
        const key = flagKey(o);
        const multi = !!(o.MultipleOptions || o.Multi);
        let opts = (o.Options || []).slice();
        const def = multi ? (Array.isArray(o.CurrentValue) ? o.CurrentValue.slice() : o.CurrentValue ? [o.CurrentValue] : []) : o.CurrentValue != null ? o.CurrentValue : opts[0];
        let value = pref(key, def);
        if (multi && !Array.isArray(value)) value = value ? [value] : [];
        const row = el("div", "eui-row is-click");
        const t = textBlock(o);
        const trig = el("button", "eui-select", { type: "button", "aria-haspopup": "listbox", "aria-expanded": "false", "aria-label": o.Name });
        const cur = el("span");
        if (o.Sensitive) cur.setAttribute("data-sensitive", "");
        trig.append(cur, icon("chevron"));
        row.append(t.wrap, trig);
        target().append(row);
        const text = () => {
          if (multi) return value.length === 0 ? "None" : value.length <= 2 ? value.join(", ") : value.length + " selected";
          return value != null && value !== "" ? String(value) : "Select";
        };
        function paint() {
          cur.textContent = text();
          trig.classList.toggle("is-empty", multi ? !value.length : value == null || value === "");
        }
        function set(v, fire) {
          value = multi ? (Array.isArray(v) ? v.slice() : []) : v;
          W.SaveSettings(key, multi ? value.slice() : value);
          paint();
          if (fire) safeCall(o.Callback, multi ? value.slice() : value);
        }
        row.addEventListener("click", () => {
          if (pop && pop.anchor === trig) { closePopover(); return; }
          const items = opts.map((opt) => ({
            label: String(opt),
            selected: multi ? value.indexOf(opt) !== -1 : opt === value,
            action: () => {
              if (multi) {
                const i = value.indexOf(opt);
                const next = value.slice();
                if (i === -1) next.push(opt); else next.splice(i, 1);
                set(next, true);
              } else set(opt, true);
            }
          }));
          openMenu(trig, items, { select: true, multi, search: o.Search != null ? o.Search : opts.length > 7, matchWidth: true, label: o.Name });
        });
        paint();
        const ctl = {
          SetValue: (v) => set(v, true),
          GetValue: () => (multi ? value.slice() : value),
          Refresh(newOptions, keep) {
            opts = (newOptions || []).slice();
            if (!keep) {
              if (multi) value = value.filter((v) => opts.indexOf(v) !== -1);
              else if (opts.indexOf(value) === -1) value = opts[0] != null ? opts[0] : "";
            }
            paint();
          }
        };
        ctl.UpdateOptions = ctl.Refresh;
        ctl._load = ctl.SetValue;
        register(entry({ id: key, flag: key, name: o.Name, type: "dropdown", row, api: ctl, display: text, reset: () => set(def, true), copyText: () => (multi ? value.join(", ") : String(value)) }));
        return ctl;
      };

      api.CreateSegmented = function (o) {
        o = o || {};
        const key = flagKey(o);
        const opts = (o.Options || []).slice();
        const def = o.CurrentValue != null ? o.CurrentValue : opts[0];
        const row = el("div", "eui-row is-wrap");
        const t = textBlock(o);
        const seg = makeSeg(opts, opts.indexOf(pref(key, def)) !== -1 ? pref(key, def) : def, (v) => { W.SaveSettings(key, v); safeCall(o.Callback, v); }, { label: o.Name });
        row.append(t.wrap, seg.el);
        target().append(row);
        const ctl = {
          SetValue: (v) => { seg.select(v, true); },
          GetValue: () => seg.get(),
          _sync: (v) => { seg.select(v, false); W.SaveSettings(key, v); }
        };
        ctl._load = ctl.SetValue;
        register(entry({ id: key, flag: key, name: o.Name, type: "segmented", row, api: ctl, display: () => seg.get(), reset: () => seg.select(def, true), copyText: () => seg.get() }));
        return ctl;
      };

      api.CreateTextBox = function (o) {
        o = o || {};
        const key = o.Flag || null;
        const row = el("div", "eui-row is-click");
        const t = textBlock(o);
        const input = el("input", "eui-input" + (o.Mono ? " is-mono" : ""), { type: "text", placeholder: o.Placeholder || "", "aria-label": o.Name, spellcheck: "false" });
        if (o.Sensitive) input.setAttribute("data-sensitive", "");
        input.value = key ? pref(key, o.CurrentValue || "") : o.CurrentValue || "";
        row.append(t.wrap, input);
        target().append(row);
        row.addEventListener("click", (e) => { if (e.target !== input) input.focus(); });
        input.addEventListener("change", () => {
          if (key) W.SaveSettings(key, input.value);
          safeCall(o.Callback, input.value);
          if (o.RemoveTextAfterFocusLost) input.value = "";
        });
        input.addEventListener("keydown", (e) => { if (e.key === "Enter") input.blur(); });
        const ctl = { SetValue: (v) => { input.value = v == null ? "" : String(v); if (key) W.SaveSettings(key, input.value); }, GetValue: () => input.value };
        ctl._load = ctl.SetValue;
        register(entry({ id: key, flag: key, name: o.Name, type: "textbox", row, api: ctl, display: () => (o.Sensitive && state.streamer ? "•••" : input.value), reset: () => { ctl.SetValue(o.CurrentValue || ""); safeCall(o.Callback, input.value); }, copyText: () => input.value }));
        return ctl;
      };

      api.CreateLabel = function (text) {
        const row = el("div", "eui-row");
        const n = el("div", "eui-note", { text: text });
        row.append(n);
        target().append(row);
        return { SetText: (s) => { n.textContent = s; } };
      };

      api.CreateParagraph = function (o) {
        o = o || {};
        const row = el("div", "eui-row");
        if (o.Icon) { const i = el("div", "eui-para-icon"); i.append(icon(o.Icon)); row.append(i); }
        const wrap = el("div", "eui-text");
        const tt = el("div", "eui-para-title", { text: o.Title || "" });
        const p = el("p", "eui-para-body", { text: o.Content || "" });
        if (!o.Title) tt.hidden = true;
        wrap.append(tt, p);
        row.append(wrap);
        target().append(row);
        return { SetTitle: (s) => { tt.textContent = s; tt.hidden = !s; }, SetContent: (s) => { p.textContent = s; } };
      };

      api.CreateKeybind = function (o) {
        o = o || {};
        const key = flagKey(o);
        const def = normalizeKey(o.CurrentKeybind);
        let code = normalizeKey(pref(key, def));
        const row = el("div", "eui-row is-click");
        const t = textBlock(o);
        const cap = el("button", "eui-kbd eui-keycap", { type: "button", "aria-label": o.Name + " key" });
        row.append(t.wrap, cap);
        target().append(row);
        const paint = (listening) => { cap.textContent = listening ? "Press a key" : keyLabel(code); cap.classList.toggle("is-listening", !!listening); };
        paint(false);
        const set = (c, fire) => {
          code = c || null;
          W.SaveSettings(key, code);
          paint(false);
          if (fire) safeCall(o.Callback, code);
        };
        row.addEventListener("click", () => {
          paint(true);
          cap.focus({ preventScroll: true });
          capture = (e) => {
            if (e.code === "Escape") paint(false);
            else if (e.code === "Backspace" || e.code === "Delete") set(null, true);
            else set(e.code, true);
          };
        });
        cap.addEventListener("blur", () => { if (cap.classList.contains("is-listening")) { capture = null; paint(false); } });
        keybindHolds.push({ get: () => code, fn: () => safeCall(o.HoldCallback, code) });
        const ctl = { SetKeybind: (k) => set(normalizeKey(k), false), GetKeybind: () => code };
        ctl.SetValue = ctl.SetKeybind;
        ctl.GetValue = ctl.GetKeybind;
        ctl._load = (k) => set(normalizeKey(k), true);
        register(entry({ id: key, flag: key, name: o.Name, type: "keybind", row, api: ctl, display: () => keyLabel(code), reset: () => set(def, true), copyText: () => keyLabel(code) }));
        return ctl;
      };

      api.CreateColorPicker = function (o) {
        o = o || {};
        const key = flagKey(o);
        const def = toCss(o.CurrentColor || Config.Theme.Primary);
        let color = toCss(pref(key, def));
        const row = el("div", "eui-row is-click");
        const t = textBlock(o);
        const chip = el("button", "eui-color", { type: "button", "aria-haspopup": "dialog", "aria-expanded": "false", "aria-label": o.Name + ": choose color" });
        const sw = el("i");
        const hexText = el("span");
        chip.append(sw, hexText);
        row.append(t.wrap, chip);
        target().append(row);
        function set(c, fire, save) {
          color = toCss(c);
          chip.style.setProperty("--c", color);
          hexText.textContent = color;
          if (save !== false) W.SaveSettings(key, color);
          if (fire) safeCall(o.Callback, color);
        }
        set(color, false, false);
        row.addEventListener("click", () => {
          if (pop && pop.anchor === chip) { closePopover(); return; }
          openColorPicker(chip, color, (c) => set(c, true));
        });
        const ctl = { SetColor: (c) => set(c, true), GetColor: () => color, _sync: (c) => set(c, false) };
        ctl.SetValue = ctl.SetColor;
        ctl.GetValue = ctl.GetColor;
        ctl._load = ctl.SetColor;
        register(entry({ id: key, flag: key, name: o.Name, type: "color", row, api: ctl, display: () => color.toUpperCase(), reset: () => set(def, true), copyText: () => color }));
        return ctl;
      };

      api.CreateProgress = function (o) {
        o = o || {};
        let value = o.Value || o.CurrentValue || 0;
        const row = el("div", "eui-row is-col");
        const top = el("div", "eui-row-top");
        const t = textBlock(o);
        const out = el("span", "eui-readout");
        top.append(t.wrap, out);
        const bar = el("div", "eui-bar", { role: "progressbar", "aria-label": o.Name, "aria-valuemin": "0", "aria-valuemax": "100" });
        const fill = el("i");
        bar.append(fill);
        row.append(top, bar);
        target().append(row);
        const set = (v) => {
          value = clamp(Number(v) || 0, 0, 100);
          fill.style.width = value + "%";
          out.textContent = o.Text ? safeCall(o.Text, value) : Math.round(value) + "%";
          bar.setAttribute("aria-valuenow", String(Math.round(value)));
        };
        set(value);
        return { SetValue: set, GetValue: () => value };
      };

      api.CreateGraph = function (o) {
        o = o || {};
        const n = o.Points || 60;
        const data = [];
        const row = el("div", "eui-row is-col");
        const top = el("div", "eui-row-top");
        const t = textBlock(o);
        const stat = el("div", "eui-stat");
        const num = document.createTextNode("--");
        stat.append(num);
        if (o.Suffix) stat.append(el("small", "", { text: o.Suffix }));
        top.append(t.wrap, stat);
        const cv = el("canvas", "eui-graph", { role: "img", "aria-label": o.Name + " graph" });
        row.append(top, cv);
        target().append(row);
        function draw() {
          const w = cv.clientWidth, h = cv.clientHeight;
          if (!w || !h) return;
          const dpr = Math.min(2, global.devicePixelRatio || 1);
          if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
          const ctx2 = cv.getContext("2d");
          ctx2.setTransform(dpr, 0, 0, dpr, 0, 0);
          ctx2.clearRect(0, 0, w, h);
          const cs = getComputedStyle(root);
          const pc = parseColor(cs.getPropertyValue("--eui-primary")) || { r: 139, g: 92, b: 246 };
          const ac = parseColor(cs.getPropertyValue("--eui-accent")) || pc;
          const tc = parseColor(cs.getPropertyValue("--eui-text")) || { r: 255, g: 255, b: 255 };
          ctx2.strokeStyle = rgba(tc, 0.08);
          ctx2.lineWidth = 1;
          ctx2.setLineDash([3, 4]);
          [1, 2].forEach((i) => { const y = Math.round((h * i) / 3) + 0.5; ctx2.beginPath(); ctx2.moveTo(0, y); ctx2.lineTo(w, y); ctx2.stroke(); });
          ctx2.setLineDash([]);
          if (data.length < 2) return;
          const max = o.Max != null ? o.Max : Math.max(1, Math.max.apply(null, data) * 1.2);
          const min = o.Min || 0;
          const pts = data.map((v, i) => [((n - data.length + i) / (n - 1)) * (w - 10) + 5, h - 5 - (clamp(v, min, max) - min) / (max - min || 1) * (h - 12)]);
          const trace = () => {
            ctx2.beginPath();
            ctx2.moveTo(pts[0][0], pts[0][1]);
            for (let i = 1; i < pts.length; i++) {
              const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], mx = (x0 + x1) / 2;
              ctx2.bezierCurveTo(mx, y0, mx, y1, x1, y1);
            }
          };
          trace();
          const last = pts[pts.length - 1];
          ctx2.lineTo(last[0], h);
          ctx2.lineTo(pts[0][0], h);
          ctx2.closePath();
          const fg = ctx2.createLinearGradient(0, 0, 0, h);
          fg.addColorStop(0, rgba(pc, 0.32));
          fg.addColorStop(1, rgba(pc, 0));
          ctx2.fillStyle = fg;
          ctx2.fill();
          trace();
          const lg = ctx2.createLinearGradient(0, 0, w, 0);
          lg.addColorStop(0, rgba(pc, 0.7));
          lg.addColorStop(1, rgba(ac, 1));
          ctx2.strokeStyle = lg;
          ctx2.lineWidth = 2;
          ctx2.stroke();
          ctx2.fillStyle = rgba(ac, 0.22);
          ctx2.beginPath(); ctx2.arc(last[0], last[1], 7, 0, Math.PI * 2); ctx2.fill();
          ctx2.fillStyle = "#fff";
          ctx2.beginPath(); ctx2.arc(last[0], last[1], 3, 0, Math.PI * 2); ctx2.fill();
        }
        graphs.add(draw);
        const ctl = {
          Push(v) {
            v = Number(v) || 0;
            data.push(v);
            if (data.length > n) data.shift();
            num.nodeValue = fmtNum(v, o.Increment);
            draw();
          },
          Clear() { data.length = 0; num.nodeValue = "--"; draw(); },
          SetMax(m) { o.Max = m; draw(); }
        };
        register(entry({ id: null, name: o.Name, type: "graph", row, api: ctl, display: () => (data.length ? fmtNum(data[data.length - 1], o.Increment) + (o.Suffix ? " " + o.Suffix : "") : "") }));
        return ctl;
      };

      api.CreateSubTab = function (names) {
        names = names || [];
        const box = el("div", "eui-block eui-subtabs");
        const pages = {};
        const seg = makeSeg(names, names[0], (n) => show(n), { tabs: true, label: "Sub-tabs" });
        box.append(seg.el);
        host.append(box);
        group = null;
        sectionName = "";
        function show(n) {
          names.forEach((x) => { pages[x].hidden = x !== n; });
          const p = pages[n];
          p.classList.remove("is-entering");
          void p.offsetWidth;
          p.classList.add("is-entering");
          setTimeout(() => p.classList.remove("is-entering"), 700);
          requestAnimationFrame(relayout);
        }
        const result = {};
        names.forEach((n, i) => {
          const page = el("div", "eui-block eui-sub-page", { role: "tabpanel", "aria-label": n });
          page.hidden = i !== 0;
          box.append(page);
          pages[n] = page;
          const sub = makeContainer(page, { tab: ctx.tab, reveal: ctx.reveal.concat([() => seg.select(n, true)]), trail: (ctx.trail || []).concat([n]) });
          sub.Name = n;
          sub.Select = () => seg.select(n, true);
          result[n] = sub;
          result[i + 1] = sub;
        });
        return result;
      };

      api._row = function (node) { target().append(node); return node; };
      return api;
    }

    // ─────────────────────────────────────────── floating toggle button
    W.CreateInvisibleButton = function (o) {
      o = o || {};
      const size = o.Size || 50;
      const taps = o.TapCount || 3;
      let callback = o.Callback || (() => W.Toggle());
      const p = { x: pref("InvisibleButton_X", o.Position ? o.Position[0] : 0.5), y: pref("InvisibleButton_Y", o.Position ? o.Position[1] : 0.1) };
      const btn = el("button", "eui-float", { type: "button", "aria-label": "Toggle " + W.Name });
      root.append(btn);
      const place = () => { btn.style.width = btn.style.height = size + "px"; btn.style.left = p.x * 100 + "%"; btn.style.top = p.y * 100 + "%"; };
      const setImage = (img) => { btn.textContent = ""; btn.append(icon(img || "menu") || icon("menu")); };
      setImage(o.Image);
      place();
      const wasDragged = draggable(btn, {
        canStart: () => visible,
        move(dx, dy, s) {
          if (s.bx == null) { const r = btn.getBoundingClientRect(), pr = root.getBoundingClientRect(); s.bx = r.left - pr.left + r.width / 2; s.by = r.top - pr.top + r.height / 2; s.pw = pr.width; s.ph = pr.height; }
          p.x = clamp(s.bx + dx, size / 2, s.pw - size / 2) / s.pw;
          p.y = clamp(s.by + dy, size / 2, s.ph - size / 2) / s.ph;
          place();
        },
        end() { if (o.SavePosition !== false) { W.SaveSettings("InvisibleButton_X", p.x); W.SaveSettings("InvisibleButton_Y", p.y); } }
      });
      let count = 0, timer = null;
      btn.addEventListener("click", () => {
        if (wasDragged()) return;
        count += 1;
        clearTimeout(timer);
        timer = setTimeout(() => { count = 0; }, 500);
        if (count >= taps) { count = 0; safeCall(callback); }
      });
      floatButton = {
        _sync: () => btn.classList.toggle("is-ghost", !visible),
        SetSize: (n) => { btn.style.width = btn.style.height = n + "px"; },
        SetTapCount: (n) => { o.TapCount = n; },
        SetCallback: (fn) => { callback = fn; },
        SetPosition: (x, y) => { p.x = x; p.y = y; place(); },
        SetImage: setImage,
        Destroy: () => { btn.remove(); floatButton = null; }
      };
      floatButton._sync();
      return floatButton;
    };

    // ──────────────────────────────────────────────────── keyboard
    on(document, "keydown", (e) => {
      if (capture) {
        e.preventDefault();
        e.stopPropagation();
        const fn = capture;
        capture = null;
        fn(e);
        return;
      }
      if (panicked) {
        const pk = W.GetSetting("EliteUI_PanicKey", normalizeKey(Config.PanicKey));
        if (pk && e.code === pk && !isTyping(e.target)) { e.preventDefault(); W.Panic(false); }
        return;
      }
      if (e.key === "Escape") {
        if (pop) { e.preventDefault(); const a = pop.anchor; closePopover(); if (a) a.focus({ preventScroll: true }); return; }
        if (overlays.length) { e.preventDefault(); overlays[overlays.length - 1].close(); return; }
      }
      if ((e.ctrlKey || e.metaKey) && !e.altKey && (e.key || "").toLowerCase() === "k" && Config.Search) { e.preventDefault(); openPalette(); return; }
      if (isTyping(e.target)) return;
      if (e.code === Config.ToggleKey) { e.preventDefault(); W.Toggle(); return; }
      if (e.repeat || overlays.length || e.ctrlKey || e.metaKey || e.altKey) return;
      keybindHolds.forEach((k) => { if (k.get() && k.get() === e.code) k.fn(); });
      for (const id in binds) {
        if (binds[id] === e.code && byId[id] && byId[id].activate) byId[id].activate();
      }
    }, true);

    // Mobile: hold N fingers for HoldDuration seconds
    if (Config.MobileGesture.Enabled) {
      let holdTimer = null;
      on(document, "touchstart", (e) => {
        clearTimeout(holdTimer);
        if (e.touches.length >= Config.MobileGesture.Fingers) holdTimer = setTimeout(() => W.Toggle(), Config.MobileGesture.HoldDuration * 1000);
      }, { passive: true });
      const cancel = (e) => { if (e.touches.length < Config.MobileGesture.Fingers) clearTimeout(holdTimer); };
      on(document, "touchend", cancel, { passive: true });
      on(document, "touchcancel", cancel, { passive: true });
    }

    // Cursor spotlight on the window edge and on the hovered group
    let spotEv = null, spotPending = false;
    on(root, "pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      spotEv = e;
      if (spotPending) return;
      spotPending = true;
      requestAnimationFrame(() => {
        spotPending = false;
        const ev = spotEv;
        const wr = win.getBoundingClientRect();
        win.style.setProperty("--mx", ev.clientX - wr.left + "px");
        win.style.setProperty("--my", ev.clientY - wr.top + "px");
        const g = ev.target && ev.target.closest && ev.target.closest(".eui-group");
        if (g) {
          const gr = g.getBoundingClientRect();
          g.style.setProperty("--gx", ev.clientX - gr.left + "px");
          g.style.setProperty("--gy", ev.clientY - gr.top + "px");
        }
      });
    });

    // ───────────────────────────────────────── configs + share codes
    const userKeys = (data) => Object.keys(data).filter((k) => k.indexOf("EliteUI_") !== 0 && k.indexOf("InvisibleButton_") !== 0);
    function applyData(data) {
      userKeys(data).forEach((k) => {
        const ctl = W.Flags[k];
        if (ctl && ctl._load) ctl._load(data[k]);
        else W.SaveSettings(k, data[k]);
      });
    }
    function snapshot() {
      const out = {};
      userKeys(W.Settings).forEach((k) => { out[k] = W.Settings[k]; });
      userKeys(W.Flags).forEach((k) => { const f = W.Flags[k]; if (f && f.GetValue) out[k] = f.GetValue(); });
      return out;
    }
    W.GetConfigs = () => (storage.get(configPrefix + "__index") || []).slice();
    W.SaveConfig = function (name) {
      name = String(name || "").trim();
      if (!name) return false;
      storage.set(configPrefix + name + ".cfg", snapshot());
      const list = W.GetConfigs();
      if (list.indexOf(name) === -1) { list.push(name); storage.set(configPrefix + "__index", list); }
      return true;
    };
    W.LoadConfig = function (name) {
      const data = storage.get(configPrefix + name + ".cfg");
      if (!data) return false;
      applyData(data);
      return true;
    };
    W.DeleteConfig = function (name) {
      storage.remove(configPrefix + name + ".cfg");
      storage.set(configPrefix + "__index", W.GetConfigs().filter((n) => n !== name));
      if (W.GetAutoloadConfig() === name) W.ClearAutoloadConfig();
      return true;
    };
    W.SetAutoloadConfig = (name) => storage.set(configPrefix + "autoload", name);
    W.GetAutoloadConfig = () => storage.get(configPrefix + "autoload") || null;
    W.ClearAutoloadConfig = () => storage.remove(configPrefix + "autoload");
    W.ExportConfig = function () {
      const json = JSON.stringify(snapshot());
      return "EUI1." + btoa(unescape(encodeURIComponent(json)));
    };
    W.ImportConfig = function (code) {
      const m = /^EUI1\.([A-Za-z0-9+/=]+)$/.exec(String(code || "").trim());
      if (!m) return false;
      try {
        const data = JSON.parse(decodeURIComponent(escape(atob(m[1]))));
        if (!data || typeof data !== "object" || Array.isArray(data)) return false;
        applyData(data);
        return true;
      } catch (e) { return false; }
    };
    W.ClearSettings = function () { W.Settings = {}; storage.remove(settingsKey); };

    // ───────────────────────────────────────── window-level API
    W.SetTheme = function (theme) {
      for (const k in theme || {}) if (k in THEME_VARS) Config.Theme[k] = toCss(theme[k]);
      applyTheme();
    };
    W.GetTheme = () => Object.assign({}, Config.Theme);
    W.SetLogo = setLogo;
    W.SetName = function (name) { W.Name = name; title.textContent = name; };
    W.SetSize = function (w, h) { customSize = [w, h]; applySize(); };
    W.SetScale = function (f) { state.scale = f; applySize(); requestAnimationFrame(relayout); };
    W.GetSize = function () { const r = win.getBoundingClientRect(); return { X: r.width, Y: r.height }; };
    W.GetFPS = () => fps;
    W.SetCaptureProtection = function (v) {
      if (!canProtect) return false;
      try { host.setContentProtection(!!v); return true; } catch (e) { return false; }
    };
    W.CanHideFromCapture = () => canProtect;
    W.Destroy = function () {
      cancelAnimationFrame(raf);
      cleanups.forEach((fn) => fn());
      root.remove();
    };

    // Flag helper for built-in settings: updates the visible control when one exists
    function flagSet(key, v) {
      const ctl = W.Flags[key];
      if (ctl && ctl.SetValue) ctl.SetValue(v);
      else W.SaveSettings(key, v);
    }
    let paletteTiles = [];
    const colorCtls = {};
    function applyPalette(name) {
      const p = PALETTES[name];
      if (!p) return;
      state.palette = name;
      W.SaveSettings("EliteUI_Palette", name);
      Object.assign(Config.Theme, p);
      Object.keys(p).forEach((k) => { if (colorCtls[k]) colorCtls[k]._sync(p[k]); else W.SaveSettings("EliteUI_Color_" + k, p[k]); });
      paletteTiles.forEach((t) => t.setAttribute("aria-pressed", String(t.dataset.name === name)));
      applyTheme();
    }
    W.ApplyPalette = applyPalette;
    W.GetPalettes = () => Object.keys(PALETTES);

    // ───────────────────────────────────────────── built-in settings
    let layoutCtl = null;
    function buildSettings(S) {
      const P = S.CreateSubTab(["Appearance", "Interface", "Privacy", "Configs"]);
      const A = P.Appearance, I = P.Interface, V = P.Privacy, C = P.Configs;

      A.CreateSection("Color palette", "palette");
      const tiles = el("div", "eui-tiles", { role: "group", "aria-label": "Palettes" });
      Object.keys(PALETTES).forEach((n) => {
        const p = PALETTES[n];
        const b = el("button", "eui-tile", { type: "button", "aria-pressed": String(state.palette === n), "data-name": n });
        b.style.setProperty("--a", p.Primary);
        b.style.setProperty("--b", p.Accent);
        b.style.setProperty("--c", p.Tertiary);
        b.append(el("i"), el("span", "", { text: n }));
        b.addEventListener("click", () => applyPalette(n));
        tiles.append(b);
      });
      paletteTiles = Array.from(tiles.children);
      const tileRow = el("div", "eui-row");
      tileRow.append(tiles);
      A._row(tileRow);
      const chroma = A.CreateModule({
        Name: "Chroma", Description: "Slowly cycles every color in the palette", Flag: "EliteUI_Chroma", CurrentValue: state.chroma, HUD: false,
        Callback: (v) => { state.chroma = v; if (!v) { chromaOffset = 0; applyTheme(); } }
      });
      chroma.CreateSlider({ Name: "Speed", Min: 1, Max: 10, CurrentValue: state.chromaSpeed, Flag: "EliteUI_ChromaSpeed", Callback: (v) => { state.chromaSpeed = v; } });

      A.CreateSection("Custom colors", "droplet");
      [["Primary", "Main color for buttons, switches and highlights"], ["Accent", "Second gradient stop"], ["Tertiary", "Third gradient stop"], ["Background", "Window base under the glass"], ["Secondary", "Menus, dialogs and popovers"]].forEach(([k, d]) => {
        colorCtls[k] = A.CreateColorPicker({
          Name: k === "Secondary" ? "Surface" : k, Description: d, Flag: "EliteUI_Color_" + k, CurrentColor: Config.Theme[k],
          Callback: (c) => { Config.Theme[k] = c; applyTheme(); }
        });
      });

      A.CreateSection("Material", "layers");
      A.CreateToggle({ Name: "Frosted glass", Description: "Blur whatever is behind the window", Flag: "EliteUI_Acrylic", CurrentValue: state.acrylic, Callback: (v) => { state.acrylic = v; applyMaterial(); } });
      A.CreateSlider({ Name: "Glow", Min: 0, Max: 100, Increment: 5, Suffix: "%", Flag: "EliteUI_Glow", CurrentValue: state.glow, Callback: (v) => { state.glow = v; applyTheme(); } });
      A.CreateSlider({ Name: "Roundness", Min: 4, Max: 22, Suffix: "px", Flag: "EliteUI_Roundness", CurrentValue: state.roundness, Callback: (v) => { state.roundness = v; applyMaterial(); requestAnimationFrame(relayout); } });
      A.CreateDropdown({ Name: "Backdrop", Description: "Shown behind EliteUI while it is open", Options: ["Aurora", "Dim", "None"], Flag: "EliteUI_Backdrop", CurrentValue: state.backdrop, Callback: (v) => { state.backdrop = v; applyMaterial(); } });
      A.CreateSegmented({ Name: "Particles", Options: ["None", "Snow", "Embers"], Flag: "EliteUI_Particles", CurrentValue: state.particles, Callback: (v) => { state.particles = v; seedParticles(); } });

      I.CreateSection("Layout", "grid");
      layoutCtl = I.CreateSegmented({ Name: "Layout", Description: "Panels opens every tab as its own floating panel", Options: LAYOUTS, Flag: "EliteUI_Layout", CurrentValue: state.layout, Callback: (v) => setLayout(v, true) });
      I.CreateSlider({ Name: "UI scale", Min: 70, Max: 130, Increment: 5, Suffix: "%", Flag: "EliteUI_UIScale", CurrentValue: Math.round((state.scale || 1) * 100), Callback: (v) => W.SetScale(v / 100) });
      I.CreateSegmented({ Name: "Animations", Options: ["Full", "Reduced", "Off"], Flag: "EliteUI_Animations", CurrentValue: state.motion, Callback: (v) => { state.motion = v; applyMaterial(); seedParticles(); } });

      I.CreateSection("Controls", "keyboard");
      I.CreateKeybind({ Name: "Open and close", Description: "Mobile: hold " + Config.MobileGesture.Fingers + " fingers for " + Config.MobileGesture.HoldDuration + "s", Flag: "EliteUI_ToggleKey", CurrentKeybind: Config.ToggleKey, Callback: (k) => { if (k) Config.ToggleKey = k; } });
      I.CreateParagraph({ Icon: "sparkles", Title: "Shortcuts", Content: MOD + " K searches everything. Right-click (or long-press) any setting to reset it, copy its value or bind it to a key." });

      I.CreateSection("Overlays", "monitor");
      I.CreateToggle({ Name: "Watermark", Description: "Name, frame rate and clock in the corner", Flag: "EliteUI_Watermark", CurrentValue: state.watermark, Callback: (v) => { state.watermark = v; refreshHud(); } });
      I.CreateToggle({ Name: "Active features", Description: "Lists every toggle that is on", Flag: "EliteUI_ActiveList", CurrentValue: state.activeList, Callback: (v) => { state.activeList = v; refreshHud(); } });
      I.CreateToggle({ Name: "Notifications", Flag: "EliteUI_ShowNotifications", CurrentValue: state.notifications, Callback: (v) => { state.notifications = v; W.NotificationsEnabled = v; } });
      I.CreateButton({ Name: "Send a test notification", Icon: "bell", Callback: () => W.Notify({ Title: "Notifications work", Content: "This is how alerts from your script will look.", Type: "success" }) });

      V.CreateSection("Streaming", "radio");
      V.CreateToggle({ Name: "Streamer mode", Description: "Blurs your name, avatar and anything a script marks as private", Flag: "EliteUI_StreamerMode", CurrentValue: state.streamer, Callback: (v) => { state.streamer = v; applyMaterial(); } });
      const capCtl = V.CreateToggle({
        Name: "Hide from screen capture",
        Description: canProtect ? "Viewers and recordings see nothing; you still see EliteUI" : "Needs the EliteUI desktop app. A browser page can't hide itself from screen capture.",
        Flag: "EliteUI_CaptureProtection", CurrentValue: false,
        Callback: (v) => { if (!W.SetCaptureProtection(v) && v) W.Notify({ Title: "Not available here", Content: "Run EliteUI in the desktop app to hide it from capture.", Type: "warning" }); }
      });
      if (!canProtect) capCtl.SetDisabled(true);
      else if (capCtl.GetValue()) W.SetCaptureProtection(true);
      V.CreateKeybind({ Name: "Panic key", Description: "Hides EliteUI and its HUD instantly. Press again to bring it back.", Flag: "EliteUI_PanicKey", CurrentKeybind: Config.PanicKey, HoldCallback: () => W.Panic(true) });

      C.CreateSection("Save", "save");
      let cfgName = "";
      C.CreateTextBox({ Name: "Config name", Placeholder: "e.g. ranked", Callback: (v) => { cfgName = v.trim(); } });
      const picker = { ctl: null };
      C.CreateButton({
        Name: "Save config", Style: "Primary", Icon: "save",
        Callback: () => {
          if (!cfgName) return W.Notify({ Title: "Name needed", Content: "Type a config name first, then save.", Type: "warning" });
          W.SaveConfig(cfgName);
          picker.ctl.Refresh(W.GetConfigs(), true);
          picker.ctl.SetValue(cfgName);
          W.Notify({ Title: "Config saved", Content: '"' + cfgName + '" holds your current settings.', Type: "success" });
        }
      });
      C.CreateSection("Saved", "folder");
      picker.ctl = C.CreateDropdown({ Name: "Config", Options: W.GetConfigs(), CurrentValue: "", Flag: "EliteUI_ConfigSelected" });
      const selected = () => picker.ctl.GetValue();
      const autoRow = { ctl: null };
      C.CreateButton({ Name: "Load config", Icon: "download", Callback: () => {
        const n = selected();
        if (n && W.LoadConfig(n)) W.Notify({ Title: "Config loaded", Content: '"' + n + '" is active.', Type: "success" });
        else W.Notify({ Title: "Pick a config", Content: "Save one first, then choose it above.", Type: "warning" });
      } });
      autoRow.ctl = C.CreateButton({ Name: "Load on startup", Description: "Current: " + (W.GetAutoloadConfig() || "none"), Icon: "zap", Callback: () => {
        const n = selected();
        if (!n) return;
        W.SetAutoloadConfig(n);
        autoRow.desc.textContent = "Current: " + n;
        W.Notify({ Title: "Autoload set", Content: '"' + n + '" loads every time EliteUI starts.', Type: "success" });
      } });
      autoRow.desc = autoRow.ctl.Instance.querySelector(".eui-desc");
      C.CreateButton({ Name: "Delete config", Style: "Danger", Icon: "trash", Callback: () => {
        const n = selected();
        if (!n) return;
        confirmDialog("Delete " + n + "?", "This removes the saved config. Your current settings stay as they are.", "Delete", () => {
          W.DeleteConfig(n);
          picker.ctl.Refresh(W.GetConfigs());
          autoRow.desc.textContent = "Current: " + (W.GetAutoloadConfig() || "none");
          W.Notify({ Title: "Config deleted", Content: '"' + n + '" is gone.', Icon: "trash" });
        });
      } });
      C.CreateSection("Share", "share");
      C.CreateButton({ Name: "Copy share code", Description: "A short code friends can paste to get your settings", Icon: "copy", Callback: () => copyText(W.ExportConfig(), "Share code") });
      let code = "";
      C.CreateTextBox({ Name: "Share code", Placeholder: "EUI1.…", Mono: true, Callback: (v) => { code = v; } });
      C.CreateButton({ Name: "Import share code", Icon: "upload", Callback: () => {
        if (W.ImportConfig(code)) W.Notify({ Title: "Imported", Content: "Settings from the share code are active.", Type: "success" });
        else W.Notify({ Title: "That code didn't work", Content: "Share codes start with EUI1. Paste the whole code and try again.", Type: "error" });
      } });
      C.CreateSection("Reset", "rotate");
      C.CreateButton({ Name: "Reset all settings", Style: "Danger", Icon: "rotate", Callback: () => confirmDialog("Reset everything?", "Clears every saved setting, layout and key bind for " + W.Name + ". Saved configs are kept.", "Reset", () => {
        W.ClearSettings();
        W.Notify({ Title: "Settings cleared", Content: "Reload to start from the defaults.", Type: "success" });
      }) });
    }

    // ───────────────────────────────────────── render loop: fps, particles, chroma
    let fps = 0, frames = 0, fpsT = performance.now(), last = performance.now(), chromaT = 0, raf = 0;
    let flakes = [];
    function seedParticles() {
      const mode = state.particles;
      flakes = [];
      if (mode === "None" || state.motion !== "Full") return;
      const count = Config.ParticleCount || 50;
      for (let i = 0; i < count; i++) {
        flakes.push({
          x: Math.random(), y: Math.random(), r: mode === "Snow" ? 1 + Math.random() * 2.2 : 0.8 + Math.random() * 1.8,
          v: (mode === "Snow" ? 0.03 + Math.random() * 0.05 : 0.025 + Math.random() * 0.06) * (Config.SnowEffect.Speed || 1),
          p: Math.random() * Math.PI * 2, c: Math.random()
        });
      }
    }
    function frame(now) {
      raf = requestAnimationFrame(frame);
      frames++;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (now - fpsT >= 500) {
        fps = Math.round((frames * 1000) / (now - fpsT));
        frames = 0;
        fpsT = now;
        if (state.watermark) {
          wmFpsText.nodeValue = fps + " fps";
          wmDot.style.color = fps >= 50 ? "#22c55e" : fps >= 30 ? "#f59e0b" : "#ef4444";
          const d = new Date();
          wmTime.textContent = String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
        }
      }
      if (state.chroma && state.motion !== "Off") {
        chromaOffset = (chromaOffset + dt * state.chromaSpeed * 9) % 360;
        if (now - chromaT > 50) { chromaT = now; paintTheme(); }
      }
      const w = fx.clientWidth, h = fx.clientHeight;
      const ctx2 = fx.getContext("2d");
      if (!flakes.length || !visible || !w) {
        if (fx._drawn) { ctx2.clearRect(0, 0, fx.width, fx.height); fx._drawn = false; }
        return;
      }
      if (fx.width !== w || fx.height !== h) { fx.width = w; fx.height = h; }
      ctx2.clearRect(0, 0, w, h);
      fx._drawn = true;
      const ember = state.particles === "Embers";
      const cs = ember ? getComputedStyle(root) : null;
      const pc = ember ? parseColor(cs.getPropertyValue("--eui-primary")) || { r: 139, g: 92, b: 246 } : null;
      const ac = ember ? parseColor(cs.getPropertyValue("--eui-tertiary")) || pc : null;
      for (const f of flakes) {
        f.p += dt * (ember ? 3 : 1);
        if (ember) {
          f.y -= f.v * dt;
          if (f.y < -0.03) { f.y = 1.03; f.x = Math.random(); }
          const a = 0.35 + 0.45 * (0.5 + 0.5 * Math.sin(f.p * 2));
          const col = f.c > 0.5 ? pc : ac;
          ctx2.fillStyle = rgba(col, a);
          ctx2.shadowColor = rgba(col, 0.9);
          ctx2.shadowBlur = 8;
        } else {
          f.y += f.v * dt;
          if (f.y > 1.03) { f.y = -0.03; f.x = Math.random(); }
          ctx2.fillStyle = "rgba(255, 255, 255, 0.82)";
          ctx2.shadowColor = "rgba(255, 255, 255, 0.7)";
          ctx2.shadowBlur = Config.SnowEffect.Glow === false ? 0 : 6;
        }
        ctx2.beginPath();
        ctx2.arc((f.x + Math.sin(f.p) * 0.01) * w, f.y * h, f.r, 0, Math.PI * 2);
        ctx2.fill();
      }
      ctx2.shadowBlur = 0;
    }

    // ─────────────────────────────────────────────── startup
    setLogo(options.Logo);
    applyTheme();
    applyMaterial();
    detect();
    settingsTab = createTab("Settings", "settings", "Look, layout, privacy and saved configs", true);
    buildSettings(settingsTab);
    setLayout(state.layout, false);
    seedParticles();
    refreshHud();
    raf = requestAnimationFrame(frame);

    function openWindow() {
      if (!options.LoadingTitle || state.motion === "Off") return W.Show();
      const card = el("div", "eui-card eui-loader", { role: "status" });
      card.append(makeLogo(), el("div", "eui-loader-title", { text: options.LoadingTitle }), el("div", "eui-loader-bar"));
      card.lastChild.append(el("i"));
      setLogo(options.Logo);
      root.append(card);
      root.classList.add("is-open");
      setTimeout(() => {
        card.classList.add("is-leaving");
        setTimeout(() => card.remove(), 250);
        W.Show();
      }, 900);
    }
    function runKeySystem(ks) {
      const keyStoreKey = folder + "/" + (ks.FileName || "key.txt");
      let validKeys = (ks.Keys || []).map(String);
      const loaded = ks.URL
        ? fetch(ks.URL).then((r) => r.text()).then((t) => { validKeys = validKeys.concat(t.split(/\r?\n/).map((s) => s.trim()).filter(Boolean)); }).catch(() => {})
        : Promise.resolve();
      loaded.then(() => {
        const saved = ks.SaveKey ? storage.get(keyStoreKey) : null;
        if (saved && validKeys.indexOf(saved) !== -1) return openWindow();
        const card = el("div", "eui-card eui-keysys", { role: "dialog", "aria-label": "Key required" });
        const head = el("div", "eui-keysys-head");
        const ht = el("div");
        ht.append(el("h3", "", { text: ks.Title || W.Name }), el("p", "", { text: ks.Subtitle || ks.Note || "Enter your key to continue." }));
        head.append(makeLogo(), ht);
        setLogo(options.Logo);
        const field = el("label", "eui-field");
        const input = el("input", "", { type: "text", placeholder: "Paste your key", "aria-label": "Key", autocomplete: "off", spellcheck: "false" });
        field.append(icon("key"), input);
        const status = el("div", "eui-keysys-status", { "aria-live": "polite" });
        const acts = el("div", "eui-keysys-actions");
        const getKey = el("button", "eui-btn is-ghost", { type: "button", text: "Get key" });
        const submit = el("button", "eui-btn", { type: "button", text: "Continue" });
        acts.append(getKey, submit);
        card.append(head, field, status, acts);
        root.append(card);
        input.focus();
        const check = () => {
          const k = input.value.trim();
          if (validKeys.indexOf(k) !== -1) {
            status.className = "eui-keysys-status is-ok";
            status.textContent = "Key accepted.";
            if (ks.SaveKey) storage.set(keyStoreKey, k);
            setTimeout(() => { card.classList.add("is-leaving"); setTimeout(() => card.remove(), 250); openWindow(); }, 400);
          } else {
            status.className = "eui-keysys-status is-error";
            status.textContent = k ? "That key isn't valid. Check it and try again." : "Paste a key first.";
            card.classList.remove("is-shake");
            void card.offsetWidth;
            card.classList.add("is-shake");
          }
        };
        submit.addEventListener("click", check);
        input.addEventListener("keydown", (e) => { if (e.key === "Enter") check(); });
        getKey.addEventListener("click", () => {
          if (!ks.GetKeyLink) { status.className = "eui-keysys-status"; status.textContent = "This script has no key link."; return; }
          const done = () => { status.className = "eui-keysys-status is-ok"; status.textContent = "Key link copied."; };
          const fail = () => { status.className = "eui-keysys-status"; status.textContent = ks.GetKeyLink; };
          try { navigator.clipboard.writeText(ks.GetKeyLink).then(done, fail); } catch (e) { fail(); }
        });
      });
    }
    if (options.KeySystem && options.KeySystem.Enabled) runKeySystem(options.KeySystem);
    else openWindow();

    // After the caller has built their tabs: autoload, then make sure something is selected.
    setTimeout(() => {
      const auto = W.GetAutoloadConfig();
      if (auto) W.LoadConfig(auto);
      if (!activeTab) selectTab(settingsTab);
      if (state.layout === "Panels") placePanels();
      refreshHud();
      relayout();
    }, 0);

    return W;
  }

  global.EliteUI = {
    Version: VERSION,
    CreateWindow,
    Color3,
    Palettes: PALETTES,
    Layouts: LAYOUTS.slice(),
    Icons: Object.keys(ICON_PATHS).concat(Object.keys(ICON_ALIASES)).sort()
  };
})(typeof window !== "undefined" ? window : this);
