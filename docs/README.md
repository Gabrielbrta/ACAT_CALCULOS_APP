# 📚 Documentação do Projeto ACAT - Electron + React

## 📖 Visão Geral

Sistema desktop para gerenciamento de contratos de transporte, construído com Electron e React.

## 🎯 Objetivo

Gerenciar contratos de táxi/transporte e simular cenários de operação, permitindo:
- Criar e editar contratos com múltiplas bandeiras e descontos
- Calcular valores de corridas automaticamente
- Visualizar e selecionar contratos via menu interativo
- **✨ NOVO**: Simular corridas com parâmetros personalizados
- **✨ NOVO**: Exportar relatórios para Excel com formatação profissional

## 📁 Estrutura da Documentação

Esta documentação espelha a estrutura do projeto. Navegue pelas pastas para encontrar a documentação específica de cada arquivo:

```
docs/
├── src/
│   ├── components/          # Documentação dos componentes React
│   │   ├── Button.md
│   │   ├── Card.md
│   │   ├── Contract.md
│   │   ├── Form.md
│   │   ├── Home.md
│   │   ├── List.md
│   │   ├── ListaContratos.md  # ✨ NOVO
│   │   ├── Menu.md
│   │   ├── Simulador.md
│   │   └── Title.md
│   │
│   ├── contexts/            # Documentação do Context API
│   │   └── ContractContext.md
│   │
│   ├── styles/              # Documentação dos estilos
│   │   ├── Reset.md
│   │   └── theme.md
│   │
│   ├── main.md              # Processo principal Electron
│   ├── preload.md           # Bridge script
│   └── renderer.md          # Entry point React
│
├── configs/                 # Configurações do projeto
│   ├── forge.config.md
│   ├── vite.main.config.md
│   ├── vite.preload.config.md
│   └── vite.renderer.config.md
│
└── README.md                # Este arquivo
```

## 🔄 Fluxo de Dados Global

```
┌──────────────────────────────────────────────────────────┐
│              ELECTRON MAIN PROCESS                       │
│  Gerencia janela, IPC, file system                      │
└────────────────────┬─────────────────────────────────────┘
                     │ IPC
┌────────────────────▼─────────────────────────────────────┐
│              PRELOAD SCRIPT                              │
│  Bridge seguro entre main e renderer                     │
└────────────────────┬─────────────────────────────────────┘
                     │ window.Api.*
┌────────────────────▼─────────────────────────────────────┐
│         REACT RENDERER PROCESS                           │
│  ┌────────────────────────────────────────┐             │
│  │   ContractContext (Estado Global)      │             │
│  └──────────────┬─────────────────────────┘             │
│                 │ useContract()                          │
│  ┌──────────────▼─────────────────────────┐             │
│  │  Home → Menu, Contract, Form           │             │
│  └────────────────────────────────────────┘             │
└──────────────────────────────────────────────────────────┘
```

## 🛠️ Tecnologias

- **Electron 37.2.5**: Framework desktop
- **React 19.1.1**: UI library
- **Vite 5.x**: Build tool
- **React Router 7.13.0**: Navegação entre páginas
- **styled-components 6.1.19**: CSS-in-JS
- **react-hook-form 7.62.0**: Gerenciamento de formulários
- **zod 4.0.15**: Validação de schemas
- **xlsx-js-style**: Exportação Excel com estilos
- **react-toastify 11.0.5**: Notificações
- **FontAwesome**: Ícones
- **Electron Forge**: Packaging e distribuição

## 🚀 Como Usar Esta Documentação

1. **Para entender um componente específico**: Navegue até `docs/src/components/[NomeDoComponente].md`
2. **Para entender o fluxo de dados**: Leia `docs/src/contexts/ContractContext.md`
3. **Para entender a comunicação Electron**: Leia `docs/src/main.md` e `docs/src/preload.md`
4. **Para configurações**: Veja `docs/configs/`

## 📊 Arquitetura

### Context API (Gerenciamento de Estado)
- **Localização**: `src/contexts/ContractContext.jsx`
- **Função**: Centralizar estado e lógica de contratos
- **Benefícios**: Elimina prop drilling, facilita manutenção

### Componentes
- **Apresentacionais**: Button, Title (apenas UI)
- **Inteligentes**: Form, Contract, Menu (lógica de negócio)
- **Layout**: Home (estrutura grid)

### Comunicação Electron
```
Renderer (React) 
  ↓ window.Api.* 
Preload (contextBridge) 
  ↓ ipcRenderer 
Main (Node.js/Electron)
```

## 🔐 Segurança

- ✅ `contextIsolation: true`
- ✅ `nodeIntegration: false`
- ✅ Preload script com contextBridge
- ✅ DevTools apenas em dev

## 📝 Convenções

### Nomenclatura
- **Componentes**: PascalCase (Button.jsx, Home.jsx)
- **Hooks customizados**: useNome (useContract)
- **Arquivos de config**: kebab-case (.config.mjs)

### Estrutura de Componentes
```jsx
// 1. Imports
import React from 'react';

// 2. Styled Components
const Container = styled.div`...`;

// 3. Componente
const NomeComponente = () => {
  // 3.1 Hooks
  // 3.2 Estado
  // 3.3 Funções
  // 3.4 Return JSX
};

// 4. Export
export default NomeComponente;
```

## 🎨 Tema

Todos os estilos seguem o tema definido em `src/styles/theme.jsx`:
- Cores consistentes
- Espaçamentos padronizados
- Tamanhos de texto unificados

## 📦 Dados

Contratos são salvos em JSON:
- **Localização**: `userData/contratos.json`
- **Estrutura**: Array de objetos
- **Acesso**: Via IPC (window.Api)

## 🆕 Novas Funcionalidades (v1.1.0)

### Simulador de Corridas
- **Dois modos de simulação**: KM variado (range) ou KM fixo
- **Parâmetros personalizáveis**: Bandeira, bandeirada, desconto, KM, quantidade
- **Exportação Excel estilizada**: Cores corporativas, bordas, formatação profissional
- **Relatórios dinâmicos**: Detalhado (variado) ou resumido (fixo)
- **Validação robusta**: Schemas dinâmicos com Zod
- **Máscaras de input**: Valores monetários e numéricos
- **Performance**: Suporta até 10.000 corridas

### Edição de Contratos
- **Rota dedicada**: `/editar-contrato/:id`
- **Formulário dual-mode**: Criação e edição no mesmo componente
- **Retrocompatibilidade**: Suporta formato antigo (bandeira1/2) e novo (calculos[])
- **Navegação integrada**: Acesso via tabela de contratos

### Melhorias de UI/UX
- **Design corporativo**: Paleta de cores profissional (#1E3A5F, #2C3E50)
- **PageHeader**: Breadcrumbs em todas as páginas
- **Submenu interativo**: Lista de contratos com hover e scroll
- **Espaçamento otimizado**: Interface mais limpa e compacta
- **Radio buttons estilizados**: Seleção visual clara
- **Loading states**: Feedback visual durante operações

---

**Versão**: 1.1.0 (TaxiCalc Pro)  
**Última Atualização**: 15 de Fevereiro de 2026  
**Autor**: Gabrielbrta
