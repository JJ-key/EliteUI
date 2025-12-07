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
└── replit.md          # This file
```

## How It Works
1. The Express server serves the documentation website at the root URL
2. The `/Loader` endpoint serves the main library Lua code
3. The `/Example` endpoint serves an example usage script
4. Roblox scripts can load the library using: `loadstring(game:HttpGet("URL/Loader"))()`

## Running the Project
```bash
npm start
```
The server runs on port 5000.

## Features of EliteUI
- Mobile-optimized UI with touch-friendly controls
- Dark blue theme
- Triple-tap gesture (3 fingers) to toggle UI
- Components: Window, Tab, Section, Button, Toggle, Slider

## API Endpoints
- `GET /` - Documentation website
- `GET /Loader` - Main library source code
- `GET /Example` - Example usage script
- `GET /api/loader-url` - Returns the full loader URL as JSON

## Technical Details
- **Runtime**: Node.js
- **Framework**: Express.js
- **Port**: 5000
- **Host**: 0.0.0.0 (accessible externally)
