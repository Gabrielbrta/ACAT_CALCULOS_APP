import { app, BrowserWindow, ipcMain } from 'electron';
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'node:path';
import started from 'electron-squirrel-startup';


// Criar __dirname para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// IPC
// Receber dados
ipcMain.on("SalvarContrato", (event, dados) => {
  const bdContratos = path.join(app.getPath("userData"), "contratos.json");
  let contratos = [];

  // se existir o arquivo, ele le os dados e insere em contratos
  if(fs.existsSync(bdContratos)){
    contratos = JSON.parse(fs.readFileSync(bdContratos, "utf-8"));
  }

  // aqui eu insiro os dados passados pelo formulario e adiciono o id único
  contratos.push({
    ...dados,
    id: Date.now(),
  });

  fs.writeFileSync(bdContratos, JSON.stringify(contratos, null, 2));

});

//Enviar dados
ipcMain.handle("getContratos", () => {
  const bdContratos = path.join(app.getPath("userData"), "contratos.json");

  if(!fs.existsSync(bdContratos)) return [];

  return  JSON.parse(fs.readFileSync(bdContratos, "utf-8"));
})