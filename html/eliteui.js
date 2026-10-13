/*
  EliteUI — HTML template (v0.1.0)
  A browser port of roblox/Loader v3.7. The API keeps the Lua names so a
  script reads the same on both platforms; only `:` becomes `.`:

    Lua:  local Tab = Window:CreateTab("Main", "home")
    JS:   const Tab = Window.CreateTab("Main", "home")

  Colors are CSS strings ("#8b5cf6") or EliteUI.Color3.fromRGB(139, 92, 246).
  Keys use KeyboardEvent.code ("ShiftRight"); Roblox names ("RightShift") also work.
*/
(function (global) {
  "use strict";

  // ---------------------------------------------------------------- icons
  // Lucide icons (same set the Roblox build uses as asset IDs).
  const ICON_PATHS = {
    home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
    player: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
    zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
    sword: '<polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" x2="19" y1="19" y2="13"/><line x1="16" x2="20" y1="16" y2="20"/><line x1="19" x2="21" y1="21" y2="19"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    palette: '<circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.65-.75 1.65-1.69 0-.44-.18-.84-.44-1.13-.29-.29-.44-.65-.44-1.13a1.64 1.64 0 0 1 1.67-1.67h2c3.05 0 5.55-2.5 5.55-5.55C21.97 6.01 17.46 2 12 2z"/>',
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
    chevron: '<path d="m6 9 6 6 6-6"/>',
    music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
    activity: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
    crown: '<path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7z"/><path d="M5 20h14"/>',
    layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
    menu: '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
    volume: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>',
    image: '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21"/>'
  };
  // Lua icon names that point at the same glyph.
  const ICON_ALIASES = {
    world: "globe", bolt: "zap", lightning: "zap", close: "x", delete: "trash",
    remove: "trash", tool: "wrench", avatar: "player", character: "player",
    user: "player", team: "users", combat: "target", crosshair: "target",
    controller: "gamepad", chart: "activity", trending: "activity",
    vip: "star", alert: "bell", notification: "bell", script: "code",
    terminal: "code", file: "folder", headphones: "music", camera: "image"
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

  // -------------------------------------------------------------- helpers
  function el(tag, cls, props) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (props) {
      for (const k in props) {
        if (k === "text") node.textContent = props[k];
        else if (k in node && typeof props[k] !== "string") node[k] = props[k];
        else node.setAttribute(k, props[k]);
      }
    }
    return node;
  }

  function safeCall(fn, ...args) {
    if (typeof fn !== "function") return;
    try { fn(...args); } catch (err) { console.error("[EliteUI] callback error:", err); }
  }

  const Color3 = {
    fromRGB(r, g, b) {
      const h = (n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
      return "#" + h(r) + h(g) + h(b);
    },
    fromHex(hex) { return hex; }
  };

  function toCss(color) {
    if (color == null) return color;
    if (typeof color === "string") return color;
    if (Array.isArray(color)) return Color3.fromRGB(color[0], color[1], color[2]);
    if (typeof color === "object" && "R" in color) {
      // Lua-style {R,G,B}; accept 0-1 (Color3.new) or 0-255.
      const k = color.R <= 1 && color.G <= 1 && color.B <= 1 ? 255 : 1;
      return Color3.fromRGB(color.R * k, color.G * k, color.B * k);
    }
    return String(color);
  }

  // Roblox Enum.KeyCode names -> KeyboardEvent.code
  const KEY_ALIASES = {
    RightShift: "ShiftRight", LeftShift: "ShiftLeft",
    RightControl: "ControlRight", LeftControl: "ControlLeft",
    RightAlt: "AltRight", LeftAlt: "AltLeft",
    Return: "Enter", Insert: "Insert", Delete: "Delete", Home: "Home", End: "End"
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
      .replace(/^Key/, "")
      .replace(/^Digit/, "")
      .replace(/^(Shift|Control|Alt|Meta)(Left|Right)$/, "$2$1")
      .replace("Control", "Ctrl");
  }
  function isTyping(target) {
    return target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
  }

  // Storage: mirrors writefile/readfile; falls back to memory when blocked.
  const memoryStore = {};
  const storage = {
    get(key) {
      try { const v = global.localStorage.getItem(key); if (v != null) return JSON.parse(v); } catch (e) { /* blocked */ }
      return key in memoryStore ? memoryStore[key] : undefined;
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

  // ------------------------------------------------------------- defaults
  const DEFAULTS = {
    Theme: {
      Primary: "#8b5cf6",
      Background: "#0f0f14",
      Secondary: "#1e1e28",
      Text: "#ffffff",
      TextSecondary: "#9ca3af",
      Accent: "#a855f7"
    },
    ToggleKey: "ShiftRight",
    MobileGesture: { Enabled: true, Fingers: 3, HoldDuration: 0.8 },
    Animation: { Enabled: true, Duration: 0.3 },
    SaveSettings: { Enabled: true, FolderName: "EliteUI", FileName: "settings.json", ConfigFolder: "Configs" },
    UIScale: { PC: 1.0, Mobile: 0.85, Tablet: 0.9 },
    SnowEffect: { Enabled: false, ParticleCount: 50, Speed: 1, Glow: true }
  };
  const THEME_VARS = {
    Primary: "--eui-primary", Accent: "--eui-accent", Background: "--eui-background",
    Secondary: "--eui-secondary", Text: "--eui-text", TextSecondary: "--eui-text-secondary"
  };
  const SWATCHES = ["#8b5cf6", "#a855f7", "#7c3aed", "#ec4899", "#ef4444", "#f97316", "#eab308", "#22c55e", "#14b8a6", "#06b6d4"];
  const THEME_PRESETS = {
    "Dark Cyan": "#06b6d4", "Dark Green": "#22c55e", "Dark Orange": "#f97316", "Dark Pink": "#ec4899",
    "Dark Purple": "#8b5cf6", "Dark Red": "#ef4444", "Dark Yellow": "#eab308", "Violet": "#a855f7"
  };
  const SIZE_PRESETS = { "Small": [350, 300], "Normal": [420, 380], "Large": [500, 450], "Extra Large": [600, 520] };

  function merge(base, extra) {
    const out = {};
    for (const k in base) out[k] = (base[k] && typeof base[k] === "object" && !Array.isArray(base[k])) ? Object.assign({}, base[k]) : base[k];
    if (!extra) return out;
    for (const k in extra) {
      if (extra[k] === undefined) continue;
      if (out[k] && typeof out[k] === "object" && extra[k] && typeof extra[k] === "object") Object.assign(out[k], extra[k]);
      else if (k === "Animation" && typeof extra[k] === "boolean") out[k].Enabled = extra[k];
      else out[k] = extra[k];
    }
    return out;
  }

  const reducedMotion = () => global.matchMedia && global.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ========================================================== CreateWindow
  function CreateWindow(options) {
    options = options || {};
    const Config = merge(DEFAULTS, {
      Theme: options.Theme, ToggleKey: options.ToggleKey, MobileGesture: options.MobileGesture,
      Animation: options.Animation, UIScale: options.UIScale, SnowEffect: options.SnowEffect,
      SaveSettings: {
        FolderName: options.SaveFolder || DEFAULTS.SaveSettings.FolderName,
        FileName: options.SaveFile || DEFAULTS.SaveSettings.FileName,
        ConfigFolder: options.ConfigFolder || DEFAULTS.SaveSettings.ConfigFolder
      }
    });
    for (const k in Config.Theme) Config.Theme[k] = toCss(Config.Theme[k]);
    Config.ToggleKey = normalizeKey(Config.ToggleKey);

    const parent = options.Parent || document.body;
    const folder = Config.SaveSettings.FolderName;
    const settingsKey = folder + "/" + Config.SaveSettings.FileName;
    const configPrefix = folder + "/" + Config.SaveSettings.ConfigFolder + "/";
    const cleanups = [];

    const Window = {
      Name: options.Name || "EliteUI",
      Config,
      Tabs: [],
      Flags: {},
      Settings: (Config.SaveSettings.Enabled && storage.get(settingsKey)) || {},
      NotificationsEnabled: true
    };

    // ---- DOM skeleton
    const root = el("div", "eui-root");
    if (parent === document.body) root.style.position = "fixed";
    if (!Config.Animation.Enabled) root.style.setProperty("--eui-dur", "0s");

    let snowCanvas = null;
    if (Config.SnowEffect.Enabled && !reducedMotion()) {
      snowCanvas = el("canvas", "eui-snow", { "aria-hidden": "true" });
      root.appendChild(snowCanvas);
    }

    const win = el("div", "eui-window is-hidden", { role: "dialog", "aria-label": Window.Name });
    const header = el("div", "eui-header");
    const logo = el("div", "eui-logo");
    const title = el("div", "eui-title", { text: Window.Name });
    const closeBtn = el("button", "eui-close", { type: "button", "aria-label": "Close window", title: "Close" });
    closeBtn.appendChild(icon("x"));
    header.append(logo, title);
    if (options.Subtitle) header.appendChild(el("div", "eui-subtitle", { text: options.Subtitle }));
    header.appendChild(closeBtn);

    const tabList = el("nav", "eui-tabs", { "aria-label": "Tabs" });
    const userPanel = el("button", "eui-user", { type: "button", title: "Settings" });
    const user = options.User || {};
    const avatar = el("span", "eui-avatar");
    if (user.Avatar) avatar.appendChild(el("img", "", { src: user.Avatar, alt: "" }));
    else avatar.textContent = (user.Name || "Player").charAt(0).toUpperCase();
    userPanel.append(avatar, el("span", "eui-user-name", { text: user.Name || "Player" }));

    const content = el("div", "eui-content");
    win.append(header, tabList, userPanel, content);
    const toasts = el("div", "eui-toasts", { "aria-live": "polite" });
    root.append(win, toasts);
    parent.appendChild(root);

    // ---- sizing (PC vs Mobile values from the Lua source)
    let compact = false;
    let baseW = 520, baseH = 480, scale = 1, customSize = false;
    function applySize() {
      root.style.setProperty("--eui-w", baseW + "px");
      root.style.setProperty("--eui-h", baseH + "px");
      root.style.setProperty("--eui-scale", String(scale));
    }
    function detectDevice() {
      const coarse = global.matchMedia && global.matchMedia("(pointer: coarse)").matches;
      const narrow = root.clientWidth < 560 || root.clientHeight < 520;
      const next = coarse || narrow;
      if (next !== compact || !detectDevice.done) {
        compact = next;
        root.classList.toggle("eui--compact", compact);
        if (!customSize) { baseW = compact ? 420 : 520; baseH = compact ? 380 : 480; }
        detectDevice.done = true;
        applySize();
      }
    }
    detectDevice();
    if (global.ResizeObserver) {
      const ro = new ResizeObserver(detectDevice);
      ro.observe(root);
      cleanups.push(() => ro.disconnect());
    }
    scale = compact ? Config.UIScale.Mobile : Config.UIScale.PC;
    applySize();

    // ---- theme
    function applyTheme() {
      for (const k in THEME_VARS) root.style.setProperty(THEME_VARS[k], Config.Theme[k]);
    }
    applyTheme();

    // ---- logo
    function setLogo(src) {
      logo.textContent = "";
      if (src) logo.appendChild(el("img", "", { src: src, alt: "" }));
      else logo.textContent = Window.Name.charAt(0).toUpperCase();
    }
    setLogo(options.Logo);

    // ---- dragging (header)
    function makeDraggable(target, handle, onMove, canStart) {
      let start = null;
      handle.addEventListener("pointerdown", (e) => {
        const b = e.target.closest("button");
        if (e.button !== 0 || (b && b !== handle) || (canStart && !canStart())) return;
        const r = target.getBoundingClientRect();
        const pr = root.getBoundingClientRect();
        start = { x: e.clientX, y: e.clientY, left: r.left - pr.left + r.width / 2, top: r.top - pr.top + r.height / 2, moved: false };
        handle.setPointerCapture(e.pointerId);
      });
      handle.addEventListener("pointermove", (e) => {
        if (!start) return;
        const dx = e.clientX - start.x, dy = e.clientY - start.y;
        if (!start.moved && Math.hypot(dx, dy) < 4) return;
        start.moved = true;
        const r = target.getBoundingClientRect();
        const pr = root.getBoundingClientRect();
        const halfW = r.width / 2, halfH = r.height / 2;
        const x = Math.min(Math.max(start.left + dx, halfW), pr.width - halfW);
        const y = Math.min(Math.max(start.top + dy, halfH), pr.height - halfH);
        target.classList.add("is-dragged");
        target.style.left = x + "px";
        target.style.top = y + "px";
        if (onMove) onMove(x / pr.width, y / pr.height);
      });
      const end = () => { start = null; };
      handle.addEventListener("pointerup", end);
      handle.addEventListener("pointercancel", end);
      return () => start && start.moved;
    }
    makeDraggable(win, header);

    // ---- show / hide
    let visible = false;
    let floatButton = null;
    Window.Show = function () {
      visible = true;
      root.hidden = false;
      win.classList.remove("is-hidden");
      if (floatButton) floatButton._sync();
    };
    Window.Hide = function () {
      visible = false;
      win.classList.add("is-hidden");
      if (floatButton) floatButton._sync();
    };
    Window.Toggle = function () { visible ? Window.Hide() : Window.Show(); };
    Window.IsVisible = () => visible;
    closeBtn.addEventListener("click", () => Window.Hide());

    function onKey(e) {
      if (e.code === Config.ToggleKey && !isTyping(e.target) && !bindingActive) {
        e.preventDefault();
        Window.Toggle();
      }
    }
    document.addEventListener("keydown", onKey);
    cleanups.push(() => document.removeEventListener("keydown", onKey));

    // Mobile: hold N fingers for HoldDuration seconds
    if (Config.MobileGesture.Enabled) {
      let holdTimer = null;
      const onTouch = (e) => {
        clearTimeout(holdTimer);
        if (e.touches.length >= Config.MobileGesture.Fingers) {
          holdTimer = setTimeout(() => Window.Toggle(), Config.MobileGesture.HoldDuration * 1000);
        }
      };
      const cancel = (e) => { if (e.touches.length < Config.MobileGesture.Fingers) clearTimeout(holdTimer); };
      document.addEventListener("touchstart", onTouch, { passive: true });
      document.addEventListener("touchend", cancel, { passive: true });
      document.addEventListener("touchcancel", cancel, { passive: true });
      cleanups.push(() => {
        document.removeEventListener("touchstart", onTouch);
        document.removeEventListener("touchend", cancel);
        document.removeEventListener("touchcancel", cancel);
      });
    }

    // ---- settings + configs
    Window.SaveSettings = function (key, value) {
      Window.Settings[key] = value;
      if (Config.SaveSettings.Enabled) storage.set(settingsKey, Window.Settings);
    };
    Window.GetSetting = function (key, fallback) {
      return key in Window.Settings ? Window.Settings[key] : fallback;
    };
    Window.ClearSettings = function () {
      Window.Settings = {};
      storage.remove(settingsKey);
    };
    Window.GetConfigs = function () { return (storage.get(configPrefix + "__index") || []).slice(); };
    Window.SaveConfig = function (name) {
      if (!name) return false;
      storage.set(configPrefix + name + ".cfg", Object.assign({}, Window.Settings));
      const list = Window.GetConfigs();
      if (list.indexOf(name) === -1) { list.push(name); storage.set(configPrefix + "__index", list); }
      return true;
    };
    Window.LoadConfig = function (name) {
      const data = storage.get(configPrefix + name + ".cfg");
      if (!data) return false;
      for (const key in data) {
        if (key.indexOf("EliteUI_Config") === 0) continue;
        const ctl = Window.Flags[key];
        if (ctl && ctl._load) ctl._load(data[key]);
        else Window.SaveSettings(key, data[key]);
      }
      return true;
    };
    Window.DeleteConfig = function (name) {
      storage.remove(configPrefix + name + ".cfg");
      storage.set(configPrefix + "__index", Window.GetConfigs().filter((n) => n !== name));
      if (Window.GetAutoloadConfig() === name) Window.ClearAutoloadConfig();
      return true;
    };
    Window.SetAutoloadConfig = (name) => storage.set(configPrefix + "autoload", name);
    Window.GetAutoloadConfig = () => storage.get(configPrefix + "autoload") || null;
    Window.ClearAutoloadConfig = () => storage.remove(configPrefix + "autoload");

    // ---- window API
    Window.SetTheme = function (theme) {
      for (const k in theme) if (k in THEME_VARS) Config.Theme[k] = toCss(theme[k]);
      applyTheme();
    };
    Window.SetLogo = setLogo;
    Window.SetName = function (name) { Window.Name = name; title.textContent = name; };
    Window.SetSize = function (w, h) { baseW = w; baseH = h; customSize = true; applySize(); };
    Window.SetScale = function (factor) { scale = factor; applySize(); };
    Window.GetSize = function () { const r = win.getBoundingClientRect(); return { X: r.width, Y: r.height }; };

    Window.Notify = function (o) {
      o = o || {};
      if (Window.NotificationsEnabled === false) return;
      const toast = el("div", "eui-toast", { role: "status" });
      const ic = el("div", "eui-toast-icon");
      ic.appendChild(icon(o.Icon || o.Image) || icon("bell"));
      const body = el("div", "eui-toast-body");
      body.append(el("div", "eui-toast-title", { text: o.Title || "Notification" }), el("div", "eui-toast-text", { text: o.Content || "" }));
      toast.append(ic, body);
      toasts.appendChild(toast);
      setTimeout(() => {
        toast.classList.add("is-leaving");
        setTimeout(() => toast.remove(), 300);
      }, (o.Duration || 3) * 1000);
    };

    // ---- tabs
    let activeTab = null;
    let bindingActive = false;

    function selectTab(tab) {
      for (const t of Window.Tabs) {
        const on = t === tab;
        t._page.hidden = !on;
        if (t._button) {
          t._button.classList.toggle("is-active", on);
          t._button.setAttribute("aria-current", on ? "page" : "false");
        }
      }
      userPanel.classList.toggle("is-active", tab === settingsTab);
      activeTab = tab;
    }

    function createTab(name, iconName, hidden) {
      const page = el("div", "eui-page", { role: "region", "aria-label": name });
      page.hidden = true;
      content.appendChild(page);
      const Tab = makeContainer(page);
      Tab.Name = name;
      Tab._page = page;
      if (!hidden) {
        const btn = el("button", "eui-tab", { type: "button" });
        const ic = icon(iconName);
        if (ic) btn.appendChild(ic);
        btn.appendChild(el("span", "", { text: name }));
        btn.addEventListener("click", () => selectTab(Tab));
        tabList.appendChild(btn);
        Tab._button = btn;
      }
      Tab.Select = () => selectTab(Tab);
      Window.Tabs.push(Tab);
      if (!hidden && (!activeTab || activeTab === settingsTab)) selectTab(Tab);
      return Tab;
    }
    Window.CreateTab = (name, iconName) => createTab(name, iconName, false);

    // ---- components (shared by tabs and sub-tabs)
    function bindFlag(o, ctl) {
      const key = o.Flag || o.Name;
      if (key) Window.Flags[key] = ctl;
      return key;
    }

    function makeContainer(parentEl) {
      const api = {};

      api.CreateSection = function (name, iconName) {
        const row = el("div", "eui-section");
        const ic = icon(iconName);
        if (ic) row.appendChild(ic);
        row.appendChild(el("span", "", { text: name }));
        parentEl.appendChild(row);
        return { SetText: (t) => { row.lastChild.textContent = t; } };
      };

      api.CreateButton = function (o) {
        const btn = el("button", "eui-button", { type: "button", text: o.Name });
        btn.addEventListener("click", () => safeCall(o.Callback));
        parentEl.appendChild(btn);
        return { SetText: (t) => { btn.textContent = t; }, Fire: () => safeCall(o.Callback), Instance: btn };
      };

      api.CreateToggle = function (o) {
        const ctl = {};
        const key = bindFlag(o, ctl);
        let value = !!Window.GetSetting(key, o.CurrentValue);
        const row = el("div", "eui-row");
        const label = el("span", "eui-row-label", { text: o.Name });
        const sw = el("button", "eui-switch", { type: "button", role: "switch", "aria-label": o.Name });
        row.append(label, sw);
        parentEl.appendChild(row);
        function set(v, fire) {
          value = !!v;
          sw.setAttribute("aria-checked", String(value));
          Window.SaveSettings(key, value);
          if (fire) safeCall(o.Callback, value);
        }
        set(value, false);
        row.addEventListener("click", () => set(!value, true));
        ctl.SetValue = (v) => set(v, true);
        ctl.GetValue = () => value;
        ctl._load = ctl.SetValue;
        return ctl;
      };

      api.CreateSlider = function (o) {
        const ctl = {};
        const key = bindFlag(o, ctl);
        const min = o.Min != null ? o.Min : 0;
        const max = o.Max != null ? o.Max : 100;
        const step = o.Increment || 1;
        let value = Window.GetSetting(key, o.CurrentValue != null ? o.CurrentValue : min);
        const row = el("div", "eui-row eui-slider");
        const top = el("div", "eui-slider-top");
        const out = el("span", "eui-slider-value");
        top.append(el("span", "eui-row-label", { text: o.Name }), out);
        const track = el("div", "eui-track", { role: "slider", tabindex: "0", "aria-label": o.Name, "aria-valuemin": String(min), "aria-valuemax": String(max) });
        const fill = el("div", "eui-fill");
        const knob = el("div", "eui-knob");
        track.append(fill, knob);
        row.append(top, track);
        parentEl.appendChild(row);
        const decimals = (String(step).split(".")[1] || "").length;
        function set(v, fire) {
          v = Math.min(max, Math.max(min, Math.round((v - min) / step) * step + min));
          v = Number(v.toFixed(decimals));
          const changed = v !== value;
          value = v;
          const pct = max === min ? 0 : ((v - min) / (max - min)) * 100;
          fill.style.width = pct + "%";
          knob.style.left = pct + "%";
          out.textContent = v + (o.Suffix ? " " + o.Suffix : "");
          track.setAttribute("aria-valuenow", String(v));
          Window.SaveSettings(key, v);
          if (fire && changed) safeCall(o.Callback, v);
        }
        value = null;
        set(Window.GetSetting(key, o.CurrentValue != null ? o.CurrentValue : min), false);
        function fromPointer(e) {
          const r = track.getBoundingClientRect();
          set(min + ((e.clientX - r.left) / r.width) * (max - min), true);
        }
        track.addEventListener("pointerdown", (e) => { track.setPointerCapture(e.pointerId); fromPointer(e); });
        track.addEventListener("pointermove", (e) => { if (track.hasPointerCapture(e.pointerId)) fromPointer(e); });
        track.addEventListener("keydown", (e) => {
          const d = { ArrowRight: step, ArrowUp: step, ArrowLeft: -step, ArrowDown: -step }[e.key];
          if (d) { e.preventDefault(); set(value + d, true); }
        });
        ctl.SetValue = (v) => set(v, true);
        ctl.GetValue = () => value;
        ctl._load = ctl.SetValue;
        return ctl;
      };

      api.CreateDropdown = function (o) {
        const ctl = {};
        const key = bindFlag(o, ctl);
        let options = (o.Options || []).slice();
        let value = Window.GetSetting(key, o.CurrentValue != null ? o.CurrentValue : options[0]);
        const wrap = el("div", "eui-row eui-dropdown");
        const head = el("div", "eui-dropdown-head");
        const btn = el("button", "eui-dropdown-btn", { type: "button", "aria-haspopup": "listbox", "aria-expanded": "false", "aria-label": o.Name });
        const current = el("span", "");
        btn.append(current, icon("chevron"));
        head.append(el("span", "eui-row-label", { text: o.Name }), btn);
        const list = el("div", "eui-options", { role: "listbox", "aria-label": o.Name });
        list.hidden = true;
        wrap.append(head, list);
        parentEl.appendChild(wrap);
        function render() {
          current.textContent = value != null && value !== "" ? value : "Select";
          list.textContent = "";
          for (const opt of options) {
            const b = el("button", "eui-option", { type: "button", role: "option", text: opt, "aria-selected": String(opt === value) });
            b.addEventListener("click", () => { set(opt, true); open(false); });
            list.appendChild(b);
          }
        }
        function open(state) {
          list.hidden = !state;
          wrap.classList.toggle("is-open", state);
          btn.setAttribute("aria-expanded", String(state));
        }
        function set(v, fire) {
          value = v;
          Window.SaveSettings(key, v);
          render();
          if (fire) safeCall(o.Callback, v);
        }
        btn.addEventListener("click", () => open(list.hidden));
        render();
        ctl.SetValue = (v) => set(v, true);
        ctl.GetValue = () => value;
        ctl.Refresh = function (newOptions, keepValue) {
          options = (newOptions || []).slice();
          if (!keepValue && options.indexOf(value) === -1) value = options[0] != null ? options[0] : "";
          render();
        };
        ctl.UpdateOptions = ctl.Refresh;
        ctl._load = ctl.SetValue;
        return ctl;
      };

      api.CreateTextBox = function (o) {
        const ctl = {};
        const row = el("div", "eui-row");
        const input = el("input", "eui-input", { type: "text", placeholder: o.Placeholder || "", "aria-label": o.Name });
        input.value = o.CurrentValue || "";
        row.append(el("span", "eui-row-label", { text: o.Name }), input);
        parentEl.appendChild(row);
        input.addEventListener("change", () => {
          safeCall(o.Callback, input.value);
          if (o.RemoveTextAfterFocusLost) input.value = "";
        });
        input.addEventListener("keydown", (e) => { if (e.key === "Enter") input.blur(); });
        ctl.SetValue = (t) => { input.value = t; };
        ctl.GetValue = () => input.value;
        return ctl;
      };

      api.CreateLabel = function (text) {
        const node = el("div", "eui-label", { text: text });
        parentEl.appendChild(node);
        return { SetText: (t) => { node.textContent = t; } };
      };

      api.CreateParagraph = function (o) {
        const row = el("div", "eui-row eui-paragraph");
        const t = el("strong", "", { text: o.Title || "" });
        const p = el("p", "", { text: o.Content || "" });
        row.append(t, p);
        parentEl.appendChild(row);
        return { SetTitle: (s) => { t.textContent = s; }, SetContent: (s) => { p.textContent = s; } };
      };

      api.CreateKeybind = function (o) {
        const ctl = {};
        const key = bindFlag(o, ctl);
        let code = normalizeKey(Window.GetSetting(key, o.CurrentKeybind));
        const row = el("div", "eui-row");
        const btn = el("button", "eui-key", { type: "button", "aria-label": o.Name + " key" });
        row.append(el("span", "eui-row-label", { text: o.Name }), btn);
        parentEl.appendChild(row);
        let binding = false;
        const paint = () => { btn.textContent = binding ? "..." : keyLabel(code); btn.classList.toggle("is-binding", binding); };
        paint();
        btn.addEventListener("click", () => { binding = true; bindingActive = true; paint(); });
        const onKeyDown = (e) => {
          if (binding) {
            e.preventDefault();
            binding = false;
            setTimeout(() => { bindingActive = false; });
            if (e.code !== "Escape") {
              code = e.code;
              Window.SaveSettings(key, code);
              safeCall(o.Callback, code);
            }
            paint();
          } else if (code && e.code === code && !isTyping(e.target)) {
            safeCall(o.HoldCallback, code);
          }
        };
        document.addEventListener("keydown", onKeyDown, true);
        cleanups.push(() => document.removeEventListener("keydown", onKeyDown, true));
        ctl.SetKeybind = (k) => { code = normalizeKey(k); Window.SaveSettings(key, code); paint(); };
        ctl.GetKeybind = () => code;
        ctl.SetValue = ctl.SetKeybind;
        ctl.GetValue = ctl.GetKeybind;
        ctl._load = ctl.SetKeybind;
        return ctl;
      };

      api.CreateColorPicker = function (o) {
        const ctl = {};
        const key = bindFlag(o, ctl);
        let color = toCss(Window.GetSetting(key, o.CurrentColor || Config.Theme.Primary));
        const wrap = el("div", "eui-row eui-color-wrap");
        const head = el("div", "eui-color-head");
        const btn = el("button", "eui-swatch-btn", { type: "button", "aria-expanded": "false", "aria-label": o.Name + ": choose color" });
        head.append(el("span", "eui-row-label", { text: o.Name }), btn);
        const panel = el("div", "eui-swatches");
        panel.hidden = true;
        const swatchBtns = SWATCHES.map((c) => {
          const s = el("button", "eui-swatch", { type: "button", "aria-label": c, "aria-pressed": "false" });
          s.style.background = c;
          s.addEventListener("click", () => set(c, true));
          panel.appendChild(s);
          return s;
        });
        const custom = el("label", "eui-swatch eui-swatch-custom", { title: "Custom color" });
        const picker = el("input", "", { type: "color", "aria-label": o.Name + ": custom color" });
        picker.addEventListener("input", () => set(picker.value, true));
        custom.appendChild(picker);
        panel.appendChild(custom);
        wrap.append(head, panel);
        parentEl.appendChild(wrap);
        function set(c, fire) {
          color = toCss(c);
          btn.style.background = color;
          if (/^#[0-9a-f]{6}$/i.test(color)) picker.value = color;
          swatchBtns.forEach((s, i) => s.setAttribute("aria-pressed", String(SWATCHES[i].toLowerCase() === color.toLowerCase())));
          Window.SaveSettings(key, color);
          if (fire) safeCall(o.Callback, color);
        }
        btn.addEventListener("click", () => {
          panel.hidden = !panel.hidden;
          btn.setAttribute("aria-expanded", String(!panel.hidden));
        });
        set(color, false);
        ctl.SetColor = (c) => set(c, true);
        ctl.GetColor = () => color;
        ctl.SetValue = ctl.SetColor;
        ctl.GetValue = ctl.GetColor;
        ctl._load = ctl.SetColor;
        return ctl;
      };

      api.CreateSubTab = function (names) {
        const box = el("div", "eui-subtabs");
        const bar = el("div", "eui-subtab-bar", { role: "tablist" });
        box.appendChild(bar);
        parentEl.appendChild(box);
        const result = {};
        const entries = [];
        (names || []).forEach((name, i) => {
          const b = el("button", "eui-subtab", { type: "button", role: "tab", text: name });
          const page = el("div", "eui-sub-page", { role: "tabpanel", "aria-label": name });
          bar.appendChild(b);
          box.appendChild(page);
          const sub = makeContainer(page);
          sub.Name = name;
          const entry = { b, page, sub };
          entries.push(entry);
          const select = () => entries.forEach((e) => {
            const on = e === entry;
            e.page.hidden = !on;
            e.b.classList.toggle("is-active", on);
            e.b.setAttribute("aria-selected", String(on));
          });
          sub.Select = select;
          b.addEventListener("click", select);
          if (i === 0) select(); else page.hidden = true;
          result[name] = sub;
          result[i + 1] = sub; // Lua-style 1-based index
        });
        return result;
      };

      return api;
    }

    // ---- floating toggle button ("invisible button" in the Lua API)
    Window.CreateInvisibleButton = function (o) {
      o = o || {};
      const size = o.Size || 50;
      const taps = o.TapCount || 3;
      let callback = o.Callback || (() => Window.Toggle());
      const pos = { x: Window.GetSetting("InvisibleButton_X", 0.5), y: Window.GetSetting("InvisibleButton_Y", 0.1) };
      const btn = el("button", "eui-float", { type: "button", "aria-label": "Toggle " + Window.Name });
      root.appendChild(btn);
      function place() {
        btn.style.width = btn.style.height = size + "px";
        btn.style.left = pos.x * 100 + "%";
        btn.style.top = pos.y * 100 + "%";
      }
      function setImage(img) {
        btn.textContent = "";
        btn.appendChild(icon(img || "menu") || icon("menu"));
      }
      setImage(o.Image);
      place();
      const wasDragged = makeDraggable(btn, btn, (x, y) => {
        pos.x = x; pos.y = y;
        if (o.SavePosition !== false) { Window.SaveSettings("InvisibleButton_X", x); Window.SaveSettings("InvisibleButton_Y", y); }
      }, () => visible);
      let count = 0, timer = null;
      btn.addEventListener("click", () => {
        if (wasDragged()) return;
        count += 1;
        clearTimeout(timer);
        timer = setTimeout(() => { count = 0; }, 500);
        if (count >= taps) { count = 0; safeCall(callback); }
      });
      const api = {
        _sync: () => btn.classList.toggle("is-ghost", !visible),
        SetSize: (n) => { o.Size = n; btn.style.width = btn.style.height = n + "px"; },
        SetTapCount: (n) => { o.TapCount = n; },
        SetCallback: (fn) => { callback = fn; },
        SetPosition: (x, y) => { pos.x = x; pos.y = y; place(); },
        SetImage: setImage,
        Destroy: () => { btn.remove(); floatButton = null; }
      };
      floatButton = api;
      api._sync();
      return api;
    };

    Window.Destroy = function () {
      cleanups.forEach((fn) => fn());
      root.remove();
    };

    // ---- built-in Settings tab (opened from the user panel)
    const settingsTab = createTab("Settings", "settings", true);
    userPanel.addEventListener("click", () => selectTab(settingsTab));
    buildSettings(settingsTab);

    function buildSettings(S) {
      const savedAccent = Window.GetSetting("EliteUI_AccentColor");
      if (savedAccent) Window.SetTheme({ Primary: savedAccent });
      const savedScale = Window.GetSetting("EliteUI_UIScale");
      if (savedScale) Window.SetScale(savedScale / 100);
      const savedSize = SIZE_PRESETS[Window.GetSetting("EliteUI_UISizePreset")];
      if (savedSize && Window.GetSetting("EliteUI_UISizePreset") !== "Normal") Window.SetSize(savedSize[0], savedSize[1]);
      Window.NotificationsEnabled = Window.GetSetting("EliteUI_ShowNotifications", true);

      S.CreateSection("Theme Customization", "palette");
      const accent = S.CreateColorPicker({
        Name: "UI Accent Color", CurrentColor: Config.Theme.Primary, Flag: "EliteUI_AccentColor",
        Callback: (c) => Window.SetTheme({ Primary: c })
      });
      S.CreateDropdown({
        Name: "Theme Preset", Options: Object.keys(THEME_PRESETS), CurrentValue: "", Flag: "EliteUI_ThemePreset",
        Callback: (p) => { if (THEME_PRESETS[p]) accent.SetColor(THEME_PRESETS[p]); }
      });

      S.CreateSection("UI Configuration", "layers");
      S.CreateSlider({
        Name: "UI Scale", Min: 50, Max: 150, Increment: 5, Suffix: "%",
        CurrentValue: Math.round(scale * 100), Flag: "EliteUI_UIScale",
        Callback: (v) => Window.SetScale(v / 100)
      });
      S.CreateDropdown({
        Name: "UI Size Preset", Options: Object.keys(SIZE_PRESETS), CurrentValue: "Normal", Flag: "EliteUI_UISizePreset",
        Callback: (p) => { const s = SIZE_PRESETS[p]; if (s) Window.SetSize(s[0], s[1]); }
      });

      S.CreateSection("Controls", "gamepad");
      S.CreateParagraph({
        Title: "Toggle UI",
        Content: "PC: press " + keyLabel(Config.ToggleKey) + ". Mobile: hold " + Config.MobileGesture.Fingers +
          " fingers for " + Config.MobileGesture.HoldDuration + "s."
      });

      S.CreateSection("Notifications", "bell");
      S.CreateToggle({
        Name: "Show Notifications", CurrentValue: true, Flag: "EliteUI_ShowNotifications",
        Callback: (v) => { Window.NotificationsEnabled = v; }
      });
      S.CreateButton({
        Name: "Show Test Notification",
        Callback: () => Window.Notify({ Title: "Test Notification", Content: "Notifications are working.", Duration: 3 })
      });

      S.CreateSection("Config Management", "save");
      let configName = "";
      S.CreateTextBox({ Name: "Config Name", Placeholder: "Enter config name...", Callback: (v) => { configName = v.trim(); } });
      const picker = S.CreateDropdown({ Name: "Saved Configs", Options: Window.GetConfigs(), CurrentValue: "", Flag: "EliteUI_ConfigSelected" });
      const autoloadLabel = S.CreateLabel("");
      const refresh = () => {
        picker.Refresh(Window.GetConfigs());
        autoloadLabel.SetText("Autoload: " + (Window.GetAutoloadConfig() || "none"));
      };
      refresh();
      S.CreateButton({
        Name: "Create Config",
        Callback: () => {
          if (!configName) return Window.Notify({ Title: "Name needed", Content: "Type a config name, then press Create Config.", Icon: "x" });
          Window.SaveConfig(configName);
          refresh();
          picker.SetValue(configName);
          Window.Notify({ Title: "Config saved", Content: "Saved \"" + configName + "\".", Icon: "save" });
        }
      });
      S.CreateButton({
        Name: "Load Selected",
        Callback: () => {
          const n = picker.GetValue();
          if (n && Window.LoadConfig(n)) Window.Notify({ Title: "Config loaded", Content: "Loaded \"" + n + "\".", Icon: "check" });
          else Window.Notify({ Title: "No config selected", Content: "Create a config first, then pick it from Saved Configs.", Icon: "x" });
        }
      });
      S.CreateButton({
        Name: "Set Selected as Autoload",
        Callback: () => { const n = picker.GetValue(); if (n) { Window.SetAutoloadConfig(n); refresh(); } }
      });
      S.CreateButton({
        Name: "Delete Selected",
        Callback: () => {
          const n = picker.GetValue();
          if (!n) return;
          Window.DeleteConfig(n);
          refresh();
          Window.Notify({ Title: "Config deleted", Content: "Deleted \"" + n + "\".", Icon: "trash" });
        }
      });

      S.CreateSection("About", "info");
      S.CreateParagraph({
        Title: "EliteUI for HTML",
        Content: "Template build 0.1.0, ported from the Roblox library v3.7. Settings save to this browser's local storage under \"" + folder + "\"."
      });
      S.CreateButton({
        Name: "Reset All Settings",
        Callback: () => {
          Window.ClearSettings();
          Window.Notify({ Title: "Settings cleared", Content: "Reload the page to restore the defaults.", Icon: "trash" });
        }
      });
    }

    // ---- snow
    if (snowCanvas) {
      const ctx = snowCanvas.getContext("2d");
      const flakes = Array.from({ length: Config.SnowEffect.ParticleCount }, () => ({
        x: Math.random(), y: Math.random(), r: 1 + Math.random() * 2.5,
        v: (0.03 + Math.random() * 0.06) * Config.SnowEffect.Speed, drift: Math.random() * Math.PI * 2
      }));
      let raf = 0, last = performance.now();
      const frame = (now) => {
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        const w = snowCanvas.width = snowCanvas.clientWidth;
        const h = snowCanvas.height = snowCanvas.clientHeight;
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        if (Config.SnowEffect.Glow) { ctx.shadowColor = "rgba(255,255,255,0.8)"; ctx.shadowBlur = 6; }
        for (const f of flakes) {
          f.y += f.v * dt;
          f.drift += dt;
          if (f.y > 1.02) { f.y = -0.02; f.x = Math.random(); }
          ctx.beginPath();
          ctx.arc((f.x + Math.sin(f.drift) * 0.01) * w, f.y * h, f.r, 0, Math.PI * 2);
          ctx.fill();
        }
        raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
      cleanups.push(() => cancelAnimationFrame(raf));
    }

    // ---- startup: key system -> loading -> window
    function openWindow() {
      if (!options.LoadingTitle || !Config.Animation.Enabled) return Window.Show();
      const loading = el("div", "eui-loading", { role: "status", text: options.LoadingTitle });
      root.appendChild(loading);
      setTimeout(() => {
        loading.classList.add("is-done");
        setTimeout(() => loading.remove(), 300);
        Window.Show();
      }, 700);
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
        const box = el("div", "eui-keysys", { role: "dialog", "aria-label": "Key required" });
        const hdr = el("header", "", { text: ks.Title || Window.Name + " | Key System" });
        const body = el("div", "eui-keysys-body");
        const input = el("input", "eui-keysys-input", { type: "text", placeholder: "Enter key...", "aria-label": "Key", autocomplete: "off" });
        const status = el("div", "eui-keysys-status", { "aria-live": "polite" });
        const actions = el("div", "eui-keysys-actions");
        const submit = el("button", "", { type: "button", text: "Submit" });
        const getKey = el("button", "", { type: "button", text: "Get Key" });
        actions.append(submit, getKey);
        body.append(el("p", "", { text: ks.Subtitle || ks.Note || "Enter your key to continue." }), input, status, actions);
        box.append(hdr, body);
        root.appendChild(box);
        input.focus();
        const check = () => {
          const k = input.value.trim();
          if (validKeys.indexOf(k) !== -1) {
            status.className = "eui-keysys-status is-ok";
            status.textContent = "Key accepted.";
            if (ks.SaveKey) storage.set(keyStoreKey, k);
            setTimeout(() => { box.remove(); openWindow(); }, 400);
          } else {
            status.className = "eui-keysys-status is-error";
            status.textContent = k ? "That key isn't valid. Check it and try again." : "Enter a key first.";
          }
        };
        submit.addEventListener("click", check);
        input.addEventListener("keydown", (e) => { if (e.key === "Enter") check(); });
        getKey.addEventListener("click", () => {
          if (!ks.GetKeyLink) { status.className = "eui-keysys-status"; status.textContent = "No key link set for this script."; return; }
          const done = () => { status.className = "eui-keysys-status is-ok"; status.textContent = "Key link copied to clipboard."; };
          const fail = () => { status.className = "eui-keysys-status"; status.textContent = ks.GetKeyLink; };
          try { navigator.clipboard.writeText(ks.GetKeyLink).then(done, fail); } catch (e) { fail(); }
        });
      });
    }

    if (options.KeySystem && options.KeySystem.Enabled) runKeySystem(options.KeySystem);
    else openWindow();

    // Autoload after the caller has created their tabs and flags.
    setTimeout(() => {
      const auto = Window.GetAutoloadConfig();
      if (auto) Window.LoadConfig(auto);
      if (!activeTab) selectTab(settingsTab);
    }, 0);

    return Window;
  }

  global.EliteUI = {
    Version: "0.1.0",
    CreateWindow,
    Color3,
    Icons: Object.keys(ICON_PATHS).concat(Object.keys(ICON_ALIASES)).sort()
  };
})(typeof window !== "undefined" ? window : this);
