# EliteUI

A dark, mobile-friendly UI library, moving from Roblox to more platforms.

| Folder | Platform | Status |
| --- | --- | --- |
| [`roblox/`](roblox) | Roblox (Luau) | v3.7, stable |
| [`html/`](html) | Web (HTML/CSS/JS) | v0.1 template, the reference for new ports |

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

Open `html/index.html` in a browser to see the template, or run `npm start` and visit `/html/`.
