# EliteUI

A dark, mobile-friendly UI library, moving from Roblox to more platforms.

| Folder | Platform | Status |
| --- | --- | --- |
| [`roblox/`](roblox) | Roblox (Luau) | v3.7, stable |
| [`html/`](html) | Web (HTML/CSS/JS) | v0.3 template, the reference design for new ports |

Every port keeps the same API names, so scripts look alike on each platform:

```lua
-- Roblox
local EliteUI = loadstring(game:HttpGet("https://raw.githubusercontent.com/JJ-key/EliteUI/main/roblox/Loader"))()
local Window = EliteUI:CreateWindow({ Name = "My Script" })
local Tab = Window:CreateTab("Main", "home")
Tab:CreateToggle({ Name = "Enabled", CurrentValue = false, Callback = function(v) print(v) end })
```

```js
// Web: <link rel="stylesheet" href="eliteui.css"> + <script src="eliteui.js">
const Window = EliteUI.CreateWindow({ Name: "My App" });
const Tab = Window.CreateTab("Main", "home");
Tab.CreateToggle({ Name: "Enabled", CurrentValue: false, Callback: (v) => console.log(v) });
```

The old `.../main/Loader` URL still works. It forwards to `roblox/Loader`.

## HTML template (v0.3)

EliteUI is an overlay: it sits on top of a game, it isn't the game. The demo in `html/index.html` is **EliteUI Capture**, a sample recording overlay. The blocky world behind it (`html/demo/world.js`) is only a stand-in for your game.

**The demo records for real.** It captures the game view with the browser's MediaRecorder:

- Start and stop recording (F9) with a 3-second countdown and markers (F4)
- Replay buffer: keeps the last 15 to 120 seconds so you can save a moment after it happens (F8)
- Screenshots (F2), a clip library with playback, markers you can jump to, and downloads
- HUD widgets for keystrokes, clicks per second, FPS, coordinates, clock and a REC timer. They can be drawn into clips and screenshots; the menu never is
- The browser demo records video only. Audio settings are there for the desktop build

**Layouts.** One script, three looks. Pick with `Layout` or let users switch in Settings:

- `Sidebar`: the classic window with a tab rail
- `Tabs`: tabs in a strip across the top
- `Panels`: a ClickGUI like Meteor Client. Every tab is its own draggable, collapsible panel and toggles light up as modules

**Components.** Everything from the Roblox build (`CreateButton`, `CreateToggle`, `CreateSlider`, `CreateDropdown`, `CreateTextBox`, `CreateLabel`, `CreateParagraph`, `CreateKeybind`, `CreateColorPicker`, `CreateSubTab`, `CreateSection`), plus:

- `CreateModule`: a toggle that owns nested settings (`mod.CreateSlider(...)` etc.)
- `CreateSegmented`, `CreateProgress`, `CreateGraph` (live line chart), `CreateStats` (number tiles)
- `CreateList`: a list with thumbnails, actions and an empty state (`list.Add({ Title, Meta, Image, Actions })`)
- `Window.CreateWidget`: a HUD widget that stays on screen with the menu closed (`widget.SetText(...)`)
- `Window.Countdown(3)`, `Window.Flash()`, `Window.PlaySound("record")`, and `Window.Dialog` with media (`Element`, `Wide`)
- Dropdowns take `MultipleOptions = true`; long lists get a filter box
- Buttons take `Style = "Primary"` or `"Danger"`; most components take `Description`

**Built in, no code needed.**

- Search (`Ctrl K` / `⌘K`) across every tab, setting and action. `Ctrl+Enter` flips a toggle without leaving search
- Right-click or long-press any setting: reset it, copy its value, or bind it to a key
- 12 three-color palettes, a full custom color editor, and Chroma (cycling colors)
- Glow, roundness, frosted glass, backdrop (Aurora/Dim/None), particles (Snow/Embers), animation level
- Sound effects for every interaction, synthesized in the browser: three packs (Soft, Crisp, Retro), volume, optional hover ticks, and cues like `record`, `stop`, `shutter` and `marker`
- HUD layout editor: drag any widget, snap to edges and center, and positions are saved. Widget style (Glass, Solid, Minimal) and size are in Settings → HUD
- Built-in watermark (name, FPS, clock) and an active-features list
- Streamer mode (blurs your name, avatar and anything marked `Sensitive`) and a panic key
- Configs: save, load, autoload, and share codes (`EUI1.…`) to import elsewhere
- Notifications with types, actions and a pause-on-hover timer; `Window.Dialog` for confirmations

**Hide from screen capture.** A web page can't hide itself from screen capture. No browser allows it. The [`html/desktop`](html/desktop) wrapper runs the template in an Electron window and turns on Settings → Privacy → *Hide from screen capture*. That uses Electron's `setContentProtection`, which hides the window from capture on Windows 10 (version 2004 or later) and 11. On macOS, whether a recording app respects it depends on the app. Roblox scripts can't hide UI from capture either.

```sh
cd html/desktop && npm install && npm start
```

Open `html/index.html` in a browser to see the template, or run `npm start` and visit `/html/`.
