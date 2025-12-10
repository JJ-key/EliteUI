# EliteUI - Roblox Mobile UI Library

## Overview
EliteUI is a modern, mobile-optimized UI library for Roblox. This project hosts the library files via a web server so they can be loaded into Roblox scripts using `loadstring()` and `HttpGet()`.

## Project Structure
```
├── server.js          # Express server that hosts the library
├── Loader             # Main EliteUI library code (Lua)
├── Example            # Example usage script (Lua)
├── public/
│   ├── index.html     # Documentation website
│   └── styles.css     # Website styles
├── package.json       # Node.js dependencies
├── .gitignore         # Git ignore patterns
└── replit.md          # This file
```

## How It Works
1. The Express server serves the documentation website at the root URL
2. The `/Loader` endpoint serves the main library Lua code
3. The `/Example` endpoint serves an example usage script
4. Roblox scripts can load the library using: `loadstring(game:HttpGet("URL/Loader"))()`

## Running the Project
The project is configured to run automatically in Replit. The workflow "Start EliteUI Server" runs:
```bash
npm start
```
The server runs on port 5000 and is accessible via the Replit webview.

## Features of EliteUI
- Mobile-optimized UI with touch-friendly controls
- Dark blue theme
- Hold 3 fingers for 0.8 seconds to toggle UI (won't trigger during gameplay)
- Components: Window, Tab, Section, Button, Toggle, Slider, Dropdown, TextBox, Label, Paragraph, Keybind, ColorPicker, Notification

## API Endpoints
- `GET /` - Documentation website
- `GET /Loader` - Main library source code
- `GET /Example` - Example usage script
- `GET /api/loader-url` - Returns the full loader URL as JSON

## Technical Details
- **Runtime**: Node.js 20
- **Framework**: Express.js
- **Port**: 5000
- **Host**: 0.0.0.0 (accessible externally)
- **Cache Control**: Disabled (no-cache headers)
- **CORS**: Enabled for cross-origin requests

## Recent Changes
- **December 10, 2025**: Config Saving System (v3.7.0)
  - Added config management system with .cfg file format
  - Create, load, and delete config files
  - Autoload feature: set a config to load automatically on startup
  - Developer-configurable config folder via `ConfigFolder` option
  - Config files stored in: `[SaveFolder]/Configs/[name].cfg`
  - New Settings tab section: Config Management
  - New Window methods: SaveConfig, LoadConfig, DeleteConfig, GetConfigs, SetAutoloadConfig, GetAutoloadConfig, ClearAutoloadConfig
- **December 10, 2025**: Cleaner Settings Access (v3.6.2)
  - Removed settings gear icon from user panel
  - Username and profile picture are now the clickable area to access settings
  - More subtle/hidden settings access
- **December 9, 2025**: User Panel with Settings Access (v3.6.1)
  - Added user panel at bottom of sidebar showing Roblox avatar and display name
  - Clicking user panel opens the Settings tab
  - Settings tab is hidden from normal tab list (only accessible via user panel)
  - User panel has hover effects and visual feedback
  - Clean integration with existing tab system
- **December 9, 2025**: Automatic Settings tab (v3.6.0)
  - Settings tab is now automatically created when using CreateWindow
  - No need for users to manually call any settings function
  - Includes theme customization (color picker + 8 theme presets)
  - Includes UI scale slider (50%-150%) and size presets
  - Includes notification toggle and test button
  - Includes clear settings and info sections
  - All settings persist automatically
- **December 9, 2025**: Fixed UI issues (v3.5.0)
  - Increased base window dimensions for better visibility
  - Fixed tab section layout corruption
  - Removed UserInfoPanel that was causing layout issues
- **December 8, 2025**: Improved mobile gesture detection (v3.3.0)
  - Changed from triple-tap to hold-based gesture (hold 3 fingers for 0.8 seconds)
  - Prevents accidental UI toggles during gameplay when using multiple fingers
  - Hold duration is configurable via MobileGesture.HoldDuration
- **December 8, 2025**: Added custom icons and enhanced visual effects (v3.2.0)
  - Added built-in icon library with 60+ icons (home, settings, sword, shield, player, world, etc.)
  - Tabs now support custom icons: `Window:CreateTab("Main", "home")`
  - Sections now support custom icons: `Tab:CreateSection("Features", "star")`
  - Enhanced multi-layer shadow effects for better depth
  - Added glow effects to main window, buttons, and toggles
  - Glow effects animate on hover and toggle states
  - Updated Example script to demonstrate new icon features
- **December 7, 2025**: Redesigned documentation website
  - Removed emojis, replaced with clean SVG icons
  - Added interactive component previews (buttons, toggles, sliders, dropdowns, etc.)
  - Fixed component layout with responsive grid
  - Updated Example script with all available components
  - Clean, professional documentation style
- **December 8, 2025**: Imported GitHub repository and configured for Replit environment
  - Installed Node.js dependencies (express, cors, @octokit/rest)
  - Configured workflow "Start EliteUI Server" on port 5000 with webview output
  - Verified deployment configuration (autoscale deployment target)
  - Confirmed all endpoints working: /, /Loader, /Example, /api/loader-url
  - Documentation website displaying correctly with interactive components
