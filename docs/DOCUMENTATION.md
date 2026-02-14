# 📚 Documentação do Projeto ACAT - Electron + React

## 📁 Árvore de Arquivos

```
ELECTRON_REACT_SETUP/
│
├── 📂 src/
│   ├── 📂 components/          # Componentes React
│   │   ├── Button.jsx          # Botão estilizado reutilizável
│   │   ├── Card.jsx            # Card de exibição e cálculo de contrato
│   │   ├── Contract.jsx        # Área principal de visualização do contrato
│   │   ├── Form.jsx            # Formulário de criação de contratos
│   │   ├── Home.jsx            # Página principal (layout grid)
│   │   ├── List.jsx            # Lista de contratos e funcionalidades
│   │   ├── Menu.jsx            # Menu lateral esquerdo
│   │   ├── Simulador.jsx       # Página de simulador (futura)
│   │   └── Title.jsx           # Componentes de título (Title, Subtitle)
│   │
│   ├── 📂 contexts/            # Context API
│   │   └── ContractContext.jsx # Gerenciamento global de contratos
│   │
│   ├── 📂 styles/              # Estilos globais
│   │   ├── Reset.jsx           # Reset CSS global
│   │   └── theme.jsx           # Tema (cores, tamanhos, espaçamentos)
│   │
│   ├── 📂 contratos/           # Pasta para armazenar dados (JSON)
│   │
│   ├── main.js                 # Processo principal do Electron
│   ├── preload.js              # Script de ponte Electron (IPC)
│   └── renderer.jsx            # Ponto de entrada React + Router
│
├── 📄 forge.config.js          # Configuração Electron Forge
├── 📄 vite.main.config.mjs     # Config Vite para main process
├── 📄 vite.preload.config.mjs  # Config Vite para preload
├── 📄 vite.renderer.config.mjs # Config Vite para renderer (React)
├── 📄 index.html               # HTML base
├── 📄 package.json             # Dependências e scripts
└── 📄 README.MD                # Documentação básica
```

---

## 🔄 Fluxo de Dados (Data Flow)

### 1. **Inicialização da Aplicação**

```
Electron (main.js)
    ↓
Cria BrowserWindow
    ↓
Carrega index.html
    ↓
Executa preload.js (expõe APIs)
    ↓
Carrega renderer.jsx (React App)
    ↓
ContractProvider inicializa
    ↓
Carrega contratos do IPC (window.Api.PegarContratos)
    ↓
Atualiza estado global (Context)
```

### 2. **Fluxo de Criação de Contrato**

```
Usuário preenche Form.jsx
    ↓
Submit → handleSubmitForm()
    ↓
useContract().saveContrato(data)
    ↓
ContractContext → window.Api.SalvarContrato(data)
    ↓
preload.js → ipcRenderer.send("SalvarContrato")
    ↓
main.js → ipcMain.on("SalvarContrato")
    ↓
Salva em JSON (userData/contratos.json)
    ↓
ContractContext → loadContratos()
    ↓
Atualiza lista de contratos no estado
    ↓
Menu.jsx e List.jsx re-renderizam automaticamente
```

### 3. **Fluxo de Seleção de Contrato**

```
Usuário clica em List.jsx
    ↓
setCardContent(contrato.id) → Context
    ↓
Contract.jsx observa mudança (cardContent)
    ↓
getContratoById(id) → Context
    ↓
Exibe contrato no Card.jsx
```

### 4. **Arquitetura de Comunicação Electron**

```
┌─────────────────────────────────────────┐
│  Renderer Process (React)               │
│  - renderer.jsx                          │
│  - Componentes React                     │
│  - window.Api.* (exposto pelo preload)  │
└──────────────────┬──────────────────────┘
                   │
                   │ IPC (Inter-Process Communication)
                   │
┌──────────────────▼──────────────────────┐
│  Preload Script                          │
│  - contextBridge.exposeInMainWorld       │
│  - Ponte segura entre renderer e main   │
└──────────────────┬──────────────────────┘
                   │
                   │ ipcRenderer.send/invoke
                   │
┌──────────────────▼──────────────────────┐
│  Main Process (Node.js)                 │
│  - main.js                               │
│  - ipcMain.on/handle                     │
│  - Acesso ao sistema de arquivos (fs)   │
└──────────────────────────────────────────┘
```

---

## 🧩 Descrição dos Componentes

### **📂 src/main.js** (Processo Principal Electron)
**Função:** Gerencia a janela do Electron e comunicação IPC.

**Responsabilidades:**
- Criar a janela do aplicativo (`BrowserWindow`)
- Configurar segurança (`contextIsolation`, `nodeIntegration: false`)
- Gerenciar eventos do app (ready, window-all-closed, activate)
- Manipular IPC:
  - `SalvarContrato`: Salva contrato em JSON
  - `getContratos`: Retorna lista de contratos

**Tecnologias:** Electron, Node.js, fs (file system)

---

### **📂 src/preload.js** (Bridge Script)
**Função:** Ponte segura entre Renderer e Main process.

**Responsabilidades:**
- Expor APIs seguras via `contextBridge`
- Bloquear acesso direto ao Node.js no renderer
- APIs expostas:
  - `window.Api.SalvarContrato(dados)`
  - `window.Api.PegarContratos()`

**Tecnologias:** Electron (contextBridge, ipcRenderer)

---

### **📂 src/renderer.jsx** (Ponto de Entrada React)
**Função:** Inicializa a aplicação React.

**Responsabilidades:**
- Configurar React Router (`BrowserRouter`)
- Aplicar tema global (`ThemeProvider`)
- Envolver app no `ContractProvider` (Context API)
- Definir rotas:
  - `/` → Home.jsx
  - `/simulador` → Simulador.jsx

**Tecnologias:** React, React Router, styled-components

---

### **📂 src/contexts/ContractContext.jsx** (Gerenciamento de Estado Global)
**Função:** Centralizar o estado e lógica de contratos.

**Estado Gerenciado:**
- `contratos`: Array com todos os contratos
- `cardContent`: ID do contrato selecionado

**Métodos Expostos:**
- `loadContratos()`: Carrega contratos do IPC
- `saveContrato(data)`: Salva novo contrato e recarrega lista
- `getContratoById(id)`: Retorna contrato específico
- `setCardContent(id)`: Seleciona contrato

**Benefícios:**
- Elimina prop drilling
- Fonte única de verdade (Single Source of Truth)
- Facilita manutenção e escalabilidade

---

### **📂 src/components/Home.jsx** (Layout Principal)
**Função:** Define o layout grid da aplicação.

**Estrutura:**
```
┌──────────┬─────────────────┬──────────┐
│  Menu    │    Contract     │   Form   │
│  (280px) │   (1fr flex)    │ (300px)  │
└──────────┴─────────────────┴──────────┘
```

**Componentes Filhos:**
- `Menu` (esquerda)
- `Contract` (centro)
- `Form` (direita)

**Tecnologias:** React, styled-components, CSS Grid

---

### **📂 src/components/Menu.jsx** (Menu Lateral)
**Função:** Exibir lista de contratos e funcionalidades.

**Responsabilidades:**
- Mostrar lista de contratos (via `List.jsx`)
- Mostrar funcionalidades (Simulador)

**Dados do Context:**
- Não recebe props (usa `useContract()`)

---

### **📂 src/components/List.jsx** (Lista Genérica)
**Função:** Renderizar lista de itens clicáveis.

**Comportamento:**
- Se `items` existe: renderiza itens customizados
- Se não: renderiza contratos do Context
- Navegação: React Router (`useNavigate`)

**Props:**
- `title`: Título da lista (opcional)
- `items`: Array de itens customizados (opcional)

**Dados do Context:**
- `contratos`: Lista de contratos
- `setCardContent`: Seleciona contrato

---

### **📂 src/components/Contract.jsx** (Visualizador de Contrato)
**Função:** Exibir contrato selecionado ou mensagem padrão.

**Lógica:**
```javascript
if (cardContent) {
  contrato = getContratoById(cardContent)
  Exibe: <Card contrato={contrato} />
} else {
  Exibe: "Selecione o contrato"
}
```

**Dados do Context:**
- `cardContent`: ID do contrato selecionado
- `getContratoById(id)`: Busca contrato

---

### **📂 src/components/Card.jsx** (Card de Contrato)
**Função:** Exibir dados do contrato e calcular valores.

**Funcionalidades:**
- Mostrar nome do contrato
- Exibir bandeira 1 e 2 (se existir)
- Calcular descontos
- Formulário de entrada de KM para cálculo
- Cálculo em tempo real do valor da corrida

**Props:**
- `contrato`: Objeto com dados do contrato

**Tecnologias:** React, react-hook-form, styled-components

---

### **📂 src/components/Form.jsx** (Formulário de Criação)
**Função:** Criar novos contratos com validação.

**Validação (Zod Schema):**
- Nome do contrato (2-30 chars)
- Bandeira 1 (formato: 0,00 ou 00,00)
- Bandeirada 1 (formato: 0,00 ou 00,00)
- Desconto 1 (opcional)
- Checkbox: Tem Bandeira 2?
- Bandeira 2 e Bandeirada 2 (se checkbox marcado)

**Transformação de Dados:**
- Converte strings "3,54" → Number 3.54
- Remove "%" de desconto

**Submit:**
1. Valida dados (Zod)
2. Chama `saveContrato(data)` do Context
3. Reseta formulário (`reset()`)

**Dados do Context:**
- `saveContrato(data)`: Salva contrato e recarrega lista

**Tecnologias:** React, react-hook-form, zod, @hookform/resolvers

---

### **📂 src/components/Button.jsx** (Botão Reutilizável)
**Função:** Componente de botão estilizado.

**Props:**
- `children`: Conteúdo do botão

**Estilo:** Usa tema global (cores, padding, hover)

---

### **📂 src/components/Title.jsx** (Títulos)
**Função:** Componentes de título estilizados.

**Exports:**
- `Title` (h1)
- `Subtitle` (h2)

**Estilo:** Usa tema global (tamanhos, cores)

---

### **📂 src/components/Simulador.jsx** (Página Simulador)
**Função:** Página futura para simulações.

**Estado Atual:** Apenas link de voltar para home

---

### **📂 src/styles/theme.jsx** (Tema Global)
**Função:** Definir cores, tamanhos e espaçamentos.

**Estrutura:**
```javascript
export const theme = {
  color: {
    bgColorElements: '#fff',
    button: '#007bff',
    buttonHover: '#0056b3',
    title: '#333',
    subtitle: '#666',
    result: '#28a745'
  },
  text: {
    textSize: '1rem',
    titleSize: '2rem',
    titleH2Size: '1.5rem'
  },
  spacing: {
    inputPadding: '8px 12px',
    buttonPadding: '10px 20px',
    cardPadding: '20px'
  }
}
```

---

### **📂 src/styles/Reset.jsx** (Reset CSS)
**Função:** Resetar estilos padrão do navegador.

**Responsabilidades:**
- Remover margens/padding padrão
- Definir box-sizing
- Normalizar fontes

---

## 🔐 Segurança Electron

**Configurações Aplicadas:**
- ✅ `contextIsolation: true` - Isola contexto do renderer
- ✅ `nodeIntegration: false` - Bloqueia Node.js no renderer
- ✅ `preload script` - Ponte segura com contextBridge
- ✅ DevTools apenas em desenvolvimento

**Comunicação Segura:**
```
Renderer → window.Api.* → preload.js → IPC → main.js
```

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| **Electron** | Latest | Desktop app framework |
| **React** | 18+ | UI library |
| **Vite** | 5.x | Build tool |
| **React Router** | Latest | Navegação SPA |
| **styled-components** | Latest | CSS-in-JS |
| **react-hook-form** | Latest | Gerenciamento de formulários |
| **zod** | Latest | Validação de schema |
| **Electron Forge** | 7.x | Packaging & distribution |

---

## 📊 Fluxo de Dados Completo (Diagrama)

```
┌─────────────────────────────────────────────────────────────────┐
│                     ELECTRON MAIN PROCESS                        │
│  - Gerencia janela                                               │
│  - Acesso ao file system (contratos.json)                       │
│  - IPC Handlers (SalvarContrato, getContratos)                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ IPC Communication
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                      PRELOAD SCRIPT                              │
│  - contextBridge.exposeInMainWorld('Api', {...})                │
│  - Segurança: limita acesso ao main process                     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ window.Api.*
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                    REACT RENDERER PROCESS                        │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │          ContractContext (Estado Global)                  │  │
│  │  - contratos: []                                          │  │
│  │  - cardContent: ""                                        │  │
│  │  - saveContrato(), loadContratos(), getContratoById()   │  │
│  └────────────────────┬─────────────────────────────────────┘  │
│                       │                                          │
│                       │ useContract()                            │
│                       │                                          │
│  ┌────────────────────▼─────────────────────────────────────┐  │
│  │                    Home.jsx (Layout)                      │  │
│  │  ┌─────────┬──────────────────┬────────────┐            │  │
│  │  │ Menu    │   Contract       │   Form     │            │  │
│  │  │         │                  │            │            │  │
│  │  │ List    │   Card           │  Validação │            │  │
│  │  │         │                  │  (Zod)     │            │  │
│  │  └─────────┴──────────────────┴────────────┘            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Scripts Disponíveis

```bash
npm start          # Inicia app em modo dev
npm run package    # Empacota aplicação
npm run make       # Cria instaladores
npm run publish    # Publica app
```

---

## 📝 Notas de Desenvolvimento

### **Context API vs Redux**
Optamos por Context API pois:
- ✅ Projeto pequeno/médio
- ✅ Menos boilerplate
- ✅ Nativo do React
- ✅ Suficiente para gerenciar contratos

### **Validação com Zod**
Escolhemos Zod porque:
- ✅ TypeScript-first
- ✅ Integração perfeita com react-hook-form
- ✅ Validação em runtime
- ✅ Mensagens de erro customizáveis

### **Styled-Components**
Vantagens:
- ✅ CSS-in-JS
- ✅ Tema global
- ✅ Escopo automático (sem conflitos)
- ✅ Props dinâmicas

---

## 🔄 Próximas Funcionalidades

- [ ] Implementar página Simulador
- [ ] Adicionar edição de contratos
- [ ] Adicionar exclusão de contratos
- [ ] Exportar contratos para PDF
- [ ] Adicionar autenticação
- [ ] Histórico de corridas

---

**Última Atualização:** 14 de Fevereiro de 2026
**Autor:** Gabrielbrta
**Versão:** 1.0.0
