// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('Api', {
    SalvarContrato: (dados) => ipcRenderer.send("SalvarContrato", dados),
    PegarContratos: () => ipcRenderer.invoke("getContratos"),    AtualizarContrato: (id, dados) => ipcRenderer.invoke("AtualizarContrato", id, dados),
    DeletarContrato: (id) => ipcRenderer.invoke("DeletarContrato", id),});
