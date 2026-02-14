# main.js - Processo Principal do Electron

## 📍 Localização
`src/main.js`

## 🎯 Função
Gerenciar o processo principal do Electron, incluindo criação de janelas, comunicação IPC e acesso ao sistema de arquivos.

## 📦 Dependências
```javascript
import { app, BrowserWindow, ipcMain } from 'electron';
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'node:path';
import started from 'electron-squirrel-startup';
```

## 🔧 Configuração da Janela

### BrowserWindow Settings
```javascript
const mainWindow = new BrowserWindow({
  width: 800,
  height: 600,
  webPreferences: {
    preload: path.join(__dirname, 'preload.js'),
    contextIsolation: true,      // ✅ Segurança
    nodeIntegration: false,       // ✅ Segurança
  },
});
```

### Segurança Aplicada
- **contextIsolation: true**: Isola o contexto do renderer do Node.js
- **nodeIntegration: false**: Bloqueia acesso direto às APIs do Node.js no renderer
- **preload script**: Única ponte segura entre renderer e main

## 🔄 Ciclo de Vida do App

### 1. Inicialização
```javascript
app.whenReady().then(() => {
  createWindow();
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
```

### 2. Eventos do App
- **ready**: Electron está pronto, cria janela
- **activate**: macOS - recria janela ao clicar no dock
- **window-all-closed**: Fecha app quando todas as janelas fecham (exceto macOS)

## 📡 Comunicação IPC

### IPC Handler: SalvarContrato
**Canal**: `"SalvarContrato"`  
**Tipo**: One-way (renderer → main)

```javascript
ipcMain.on("SalvarContrato", (event, dados) => {
  const bdContratos = path.join(app.getPath("userData"), "contratos.json");
  let contratos = [];

  // Carrega contratos existentes
  if(fs.existsSync(bdContratos)){
    contratos = JSON.parse(fs.readFileSync(bdContratos, "utf-8"));
  }

  // Adiciona novo contrato com ID único
  contratos.push({
    ...dados,
    id: Date.now(),
  });

  // Salva no arquivo
  fs.writeFileSync(bdContratos, JSON.stringify(contratos, null, 2));
});
```

**Fluxo de Dados**:
1. Renderer chama `window.Api.SalvarContrato(dados)`
2. Preload envia via `ipcRenderer.send("SalvarContrato", dados)`
3. Main recebe, adiciona ID, salva em JSON

### IPC Handler: getContratos
**Canal**: `"getContratos"`  
**Tipo**: Two-way (renderer ↔ main)

```javascript
ipcMain.handle("getContratos", () => {
  const bdContratos = path.join(app.getPath("userData"), "contratos.json");

  if(!fs.existsSync(bdContratos)) return [];

  return JSON.parse(fs.readFileSync(bdContratos, "utf-8"));
});
```

**Fluxo de Dados**:
1. Renderer chama `await window.Api.PegarContratos()`
2. Preload invoca via `ipcRenderer.invoke("getContratos")`
3. Main lê arquivo e retorna array de contratos
4. Preload retorna promessa com dados

## 💾 Armazenamento

### Local do Arquivo
```javascript
app.getPath("userData") + "/contratos.json"
```

**Caminhos por SO**:
- **Windows**: `C:\Users\[User]\AppData\Roaming\acat\contratos.json`
- **macOS**: `~/Library/Application Support/acat/contratos.json`
- **Linux**: `~/.config/acat/contratos.json`

### Estrutura do JSON
```json
[
  {
    "id": 1707943200000,
    "nomeContrato": "Petrobras",
    "bandeira1": 3.54,
    "bandeirada1": 5.50,
    "desconto1": 10,
    "hasBandeira2": true,
    "bandeira2": 4.32,
    "bandeirada2": 6.00,
    "desconto2": 15
  }
]
```

## 🔒 Segurança

### Isolamento de Contexto
- Renderer não tem acesso direto ao Node.js
- Todas as operações sensíveis (fs, path) ficam no main
- Comunicação apenas via IPC exposto no preload

### Validação
⚠️ **Melhorias Futuras**:
- Validar dados antes de salvar
- Sanitizar entrada do usuário
- Limitar tamanho do arquivo JSON

## 🐛 Debug

### DevTools
```javascript
if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
  mainWindow.webContents.openDevTools();
}
```

DevTools abre apenas em desenvolvimento.

## 🔗 Relacionamentos

### Comunica com:
- **preload.js**: Recebe chamadas IPC do renderer
- **renderer.jsx**: Via preload/IPC
- **Sistema de Arquivos**: Lê/escreve contratos.json

### Usado por:
- **ContractContext.jsx**: Via window.Api para salvar/carregar contratos

## 📊 Fluxo de Operações

### Salvar Contrato
```
Form.jsx (submit)
  ↓
ContractContext.saveContrato(data)
  ↓
window.Api.SalvarContrato(data)
  ↓
preload.js (ipcRenderer.send)
  ↓
main.js (ipcMain.on)
  ↓
fs.writeFileSync(contratos.json)
```

### Carregar Contratos
```
ContractContext.loadContratos()
  ↓
window.Api.PegarContratos()
  ↓
preload.js (ipcRenderer.invoke)
  ↓
main.js (ipcMain.handle)
  ↓
fs.readFileSync(contratos.json)
  ↓
return JSON.parse(...)
```

## 🛠️ Melhorias Futuras

- [ ] Adicionar backup automático de contratos
- [ ] Implementar validação de dados no IPC
- [ ] Adicionar logs de erro
- [ ] Implementar atualização de contratos
- [ ] Adicionar exclusão de contratos
- [ ] Migrar para banco de dados SQLite

---

**Tipo**: Main Process  
**Linguagem**: JavaScript (ES Modules)  
**Dependências**: Electron, Node.js (fs, path)
