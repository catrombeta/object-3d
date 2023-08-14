// const { app, BrowserWindow } = require('electron');
// const path = require('path');

// function createWindow() {
//   // Cria a janela do navegador Electron
//     const mainWindow = new BrowserWindow({
//         width: 800,
//         height: 600,
//         webPreferences: {
//             nodeIntegration: true,
//             contentSecurityPolicy: "default-src 'self' 'unsafe-inline' 'unsafe-eval';"
//         },
//     });

//     mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));

// }

// app.whenReady().then(() => {
//     createWindow();

//     app.on('activate', function () {
//     if (BrowserWindow.getAllWindows().length === 0) createWindow();
//     });
// });

// // Finaliza quando todas as janelas estiverem fechadas (exceto no macOS)
// app.on('window-all-closed', function () {
//     if (process.platform !== 'darwin') app.quit();
// });