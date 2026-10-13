// Exposes the one host call EliteUI looks for. Nothing else from Node reaches the page.
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("EliteUIHost", {
  setContentProtection: (enabled) => ipcRenderer.invoke("eliteui:set-content-protection", Boolean(enabled))
});
