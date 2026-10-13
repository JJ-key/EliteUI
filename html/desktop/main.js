// EliteUI desktop host.
// Opens the HTML build in a desktop window and gives the page window.EliteUIHost, which
// turns on Settings → Privacy → "Hide from screen capture". That calls Electron's
// setContentProtection: on Windows 10 (2004+) and 11 the window is excluded from screen
// capture, so OBS, Discord and recordings don't show it while it stays visible to you.
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    backgroundColor: "#07060b",
    title: "EliteUI",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });
  win.removeMenu();
  win.loadFile(path.join(__dirname, "..", "index.html"));
}

ipcMain.handle("eliteui:set-content-protection", (event, enabled) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win) return false;
  win.setContentProtection(Boolean(enabled));
  return true;
});

app.whenReady().then(createWindow);
app.on("window-all-closed", () => app.quit());
