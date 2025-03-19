const { contextBridge, ipcRenderer } = require('electron');

// Expón ipcRenderer de manera segura al proceso de renderizado
contextBridge.exposeInMainWorld('electron', {
    invoke: (channel, data) => ipcRenderer.invoke(channel, data),
});