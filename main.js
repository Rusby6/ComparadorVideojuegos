const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const scrapeGamePrices = require('./scraper'); // Importa la función scrapeGamePrices

function createWindow() {
    const win = new BrowserWindow({
        width: 1280, // Ancho de la ventana
        height: 800, // Alto de la ventana
        fullscreenable: true, // Permite pantalla completa
        autoHideMenuBar: false, // Mostrar la barra de menú
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false,
        },
    });

    win.maximize(); // Maximizar la ventana al abrir
    win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// Manejo de la búsqueda
ipcMain.handle('search-game', async (event, gameName) => {
    console.log('Búsqueda iniciada para:', gameName);
    try {
        const results = await scrapeGamePrices(gameName); // Usa la función importada
        console.log('Resultados obtenidos:', results);
        return results;
    } catch (error) {
        console.error('Error en la búsqueda:', error);
        return [];
    }
});
