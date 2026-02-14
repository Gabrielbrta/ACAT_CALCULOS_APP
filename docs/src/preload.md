# preload.js - Bridge Script

## 📍 Localização
`src/preload.js`

## 🎯 Função
Criar uma ponte segura entre o processo renderer (React) e o processo main (Electron/Node.js) usando `contextBridge`.

## 📦 Dependências
```javascript
import { contextBridge, ipcRenderer } from 'electron';
```

## 🔐 Segurança

### Por que usar preload?
- **Isolamento**: O renderer não pode acessar diretamente APIs do Node.js
- **Controle**: Você escolhe exatamente quais APIs expor
- **Segurança**: Previne scripts maliciosos de acessar o sistema

### contextBridge
```javascript
contextBridge.exposeInMainWorld('Api', {
    // APIs expostas aqui
});
```

**O que faz**:
- Cria objeto `window.Api` no renderer
- Disponível globalmente no React
- Não polui o escopo global com outras variáveis

## 📡 APIs Expostas

### 1. SalvarContrato
**Tipo**: One-way (não retorna valor)

```javascript
SalvarContrato: (dados) => ipcRenderer.send("SalvarContrato", dados)
```

**Uso no React**:
```javascript
window.Api.SalvarContrato({
  nomeContrato: "Petrobras",
  bandeira1: 3.54,
  // ...
});
```

**Fluxo**:
```
React Component
  ↓
window.Api.SalvarContrato(dados)
  ↓
ipcRenderer.send("SalvarContrato", dados)
  ↓
main.js (ipcMain.on)
```

### 2. PegarContratos
**Tipo**: Two-way (retorna Promise)

```javascript
PegarContratos: () => ipcRenderer.invoke("getContratos")
```

**Uso no React**:
```javascript
const contratos = await window.Api.PegarContratos();
// ou
window.Api.PegarContratos().then(contratos => {
  console.log(contratos);
});
```

**Fluxo**:
```
React Component
  ↓
await window.Api.PegarContratos()
  ↓
ipcRenderer.invoke("getContratos")
  ↓
main.js (ipcMain.handle)
  ↓
return dados
  ↓
Promise resolve no React
```

## 🔄 Diferença entre send() e invoke()

### ipcRenderer.send()
- **Unidirecional**: Não espera resposta
- **Usado para**: Comandos, notificações
- **Main usa**: `ipcMain.on()`
- **Exemplo**: Salvar dados

### ipcRenderer.invoke()
- **Bidirecional**: Espera resposta (Promise)
- **Usado para**: Queries, buscas
- **Main usa**: `ipcMain.handle()`
- **Exemplo**: Buscar dados

## 🛡️ Boas Práticas de Segurança

### ✅ Correto (usado no projeto)
```javascript
// Expor APIs específicas
contextBridge.exposeInMainWorld('Api', {
    SalvarContrato: (dados) => ipcRenderer.send("SalvarContrato", dados),
    PegarContratos: () => ipcRenderer.invoke("getContratos"),
});
```

### ❌ NUNCA faça isso
```javascript
// NÃO exponha o ipcRenderer diretamente!
contextBridge.exposeInMainWorld('ipcRenderer', ipcRenderer);

// NÃO exponha require!
contextBridge.exposeInMainWorld('require', require);

// NÃO exponha fs, process, etc!
contextBridge.exposeInMainWorld('fs', require('fs'));
```

## 🔗 Relacionamentos

### Carregado por:
- **main.js**: Especificado em `webPreferences.preload`

### Usado por:
- **ContractContext.jsx**: Chama `window.Api.*`
- **Qualquer componente React**: Pode acessar `window.Api`

## 📊 Fluxo Completo de Dados

```
┌─────────────────────────────────────────┐
│         React Component                 │
│  window.Api.SalvarContrato(data)        │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│         preload.js                      │
│  ipcRenderer.send("SalvarContrato", data)│
└────────────────┬────────────────────────┘
                 │ IPC Channel
┌────────────────▼────────────────────────┐
│         main.js                         │
│  ipcMain.on("SalvarContrato", ...)     │
│  fs.writeFileSync(...)                  │
└─────────────────────────────────────────┘
```

## 🔍 Debug

### Como testar APIs no DevTools
```javascript
// No console do navegador (F12)
window.Api.SalvarContrato({ test: "data" });

await window.Api.PegarContratos();
// Deve retornar array de contratos
```

### Verificar se API está disponível
```javascript
console.log(window.Api);
// Deve mostrar: { SalvarContrato: ƒ, PegarContratos: ƒ }
```

## 🚀 Expandir APIs

### Para adicionar nova API:

1. **No preload.js**:
```javascript
contextBridge.exposeInMainWorld('Api', {
    // APIs existentes...
    
    // Nova API
    DeletarContrato: (id) => ipcRenderer.send("DeletarContrato", id),
    AtualizarContrato: (id, dados) => ipcRenderer.invoke("AtualizarContrato", id, dados),
});
```

2. **No main.js**:
```javascript
// Para send (one-way)
ipcMain.on("DeletarContrato", (event, id) => {
  // lógica de deletar
});

// Para invoke (two-way)
ipcMain.handle("AtualizarContrato", (event, id, dados) => {
  // lógica de atualizar
  return { success: true };
});
```

3. **No React**:
```javascript
// Usar nova API
window.Api.DeletarContrato(123);
const result = await window.Api.AtualizarContrato(123, { nome: "Novo" });
```

## ⚠️ Limitações

### O que NÃO pode fazer
- ❌ Acessar DOM do renderer
- ❌ Usar APIs do navegador (localStorage, etc)
- ❌ Importar módulos do renderer

### O que PODE fazer
- ✅ Usar ipcRenderer
- ✅ Usar contextBridge
- ✅ Importar módulos do Node.js (com cuidado)

## 🛠️ Melhorias Futuras

- [ ] Adicionar validação de dados antes de enviar IPC
- [ ] Implementar retry automático em caso de falha
- [ ] Adicionar timeout para operações
- [ ] Criar wrapper com TypeScript para type safety
- [ ] Adicionar logs de debug

---

**Tipo**: Preload Script  
**Linguagem**: JavaScript (ES Modules)  
**Dependências**: Electron (contextBridge, ipcRenderer)  
**Carregado em**: Processo Renderer (mas roda em contexto privilegiado)
