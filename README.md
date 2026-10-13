# EliteUI

A dark, mobile-friendly UI library, moving from Roblox to more platforms.

| Folder | Platform | Status |
| --- | --- | --- |
| [`roblox/`](roblox) | Roblox (Luau) | v3.7, stable |
| [`html/`](html) | Web (HTML/CSS/JS) | v0.2 template, the reference design for new ports |

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

## HTML template (v0.2)

**Layouts.** One script, three looks. Pick with `Layout` or let users switch in Settings:

- `Sidebar`: the classic window with a tab rail
- `Tabs`: tabs in a strip across the top
- `Panels`: a ClickGUI like Meteor Client. Every tab is its own draggable, collapsible panel and toggles light up as modules

**Components.** Everything from the Roblox build (`CreateButton`, `CreateToggle`, `CreateSlider`, `CreateDropdown`, `CreateTextBox`, `CreateLabel`, `CreateParagraph`, `CreateKeybind`, `CreateColorPicker`, `CreateSubTab`, `CreateSection`), plus:

- `CreateModule`: a toggle that owns nested settings (`mod.CreateSlider(...)` etc.)
- `CreateSegmented`, `CreateProgress`, `CreateGraph` (live line chart)
- Dropdowns take `MultipleOptions = true`; long lists get a filter box
- Buttons take `Style = "Primary"` or `"Danger"`; most components take `Description`

**Built in, no code needed.**

- Search (`Ctrl K` / `⌘K`) across every tab, setting and action. `Ctrl+Enter` flips a toggle without leaving search
- Right-click or long-press any setting: reset it, copy its value, or bind it to a key
- 12 three-color palettes, a full custom color editor, and Chroma (cycling colors)
- Glow, roundness, frosted glass, backdrop (Aurora/Dim/None), particles (Snow/Embers), animation level
- HUD: watermark (name, FPS, clock) and an active-features list
- Streamer mode (blurs your name, avatar and anything marked `Sensitive`) and a panic key
- Configs: save, load, autoload, and share codes (`EUI1.…`) to import elsewhere
- Notifications with types, actions and a pause-on-hover timer; `Window.Dialog` for confirmations

**Hide from screen capture.** A web page can't hide itself from screen capture. No browser allows it. The [`html/desktop`](html/desktop) wrapper runs the template in an Electron window and turns on Settings → Privacy → *Hide from screen capture*. That uses Electron's `setContentProtection`, which hides the window from capture on Windows 10 (version 2004 or later) and 11. On macOS, whether a recording app respects it depends on the app. Roblox scripts can't hide UI from capture either.

```sh
cd html/desktop && npm install && npm start
```

Open `html/index.html` in a browser to see the template, or run `npm start` and visit `/html/`.
