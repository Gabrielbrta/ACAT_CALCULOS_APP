# TaxiCalc Pro - Sistema de Gerenciamento de Contratos de Transporte

## 🚖 Descrição

Sistema desktop desenvolvido com Electron e React para gerenciamento completo de contratos de táxi/transporte, incluindo simulação de cenários e exportação de relatórios.

## ✨ Principais Funcionalidades

### Gerenciamento de Contratos
- Criar contratos com múltiplos cálculos (bandeiras)
- Editar contratos existentes
- Deletar contratos com confirmação
- Visualização em tabela com busca e paginação
- Seleção rápida via submenu interativo

### Simulação de Corridas (✨ NOVO)
- **Modo KM Variado**: Simula corridas com distâncias aleatórias dentro de um range
- **Modo KM Fixo**: Simula corridas com distância fixa
- Parâmetros personalizáveis: bandeira, bandeirada, desconto, quantidade
- Exportação para Excel com formatação profissional
- Cores corporativas, bordas, linhas alternadas
- Relatórios detalhados ou resumidos

### Cálculos Automáticos
- Cálculo de valor por corrida: `(KM × Bandeira) + Bandeirada - Desconto`
- Suporte a múltiplas bandeiras por contrato
- Descontos percentuais automáticos
- Visualização em cards interativos

## 🛠️ Tecnologias

### Frontend
- **React 19.1.1**: Biblioteca UI
- **React Router 7.13.0**: Navegação SPA
- **styled-components 6.1.19**: Estilização CSS-in-JS
- **react-hook-form 7.62.0**: Gerenciamento de formulários
- **Zod 4.0.15**: Validação de schemas
- **react-toastify 11.0.5**: Notificações
- **FontAwesome**: Ícones

### Backend/Desktop
- **Electron 37.2.5**: Framework desktop
- **Node.js**: Runtime
- **xlsx-js-style**: Exportação Excel com estilos

### Build Tools
- **Vite 5.x**: Build tool e dev server
- **Electron Forge**: Packaging e distribuição

## 🚀 Como Usar

### Pré-requisitos
- Node.js 18+ (recomendado 20+)
- npm 8+

### Instalação
```bash
# Clonar repositório
git clone [url-do-repositorio]

# Navegar para a pasta
cd ELECTRON_REACT_SETUP

# Instalar dependências
npm install
```

### Executar em Desenvolvimento
```bash
npm start
```

### Build para Produção
```bash
npm run make
```

## 📚 Documentação

Documentação completa disponível em `docs/`:
- [README.md](docs/README.md) - Visão geral
- [DOCUMENTATION.md](docs/DOCUMENTATION.md) - Documentação técnica detalhada
- [docs/src/components/](docs/src/components/) - Documentação de cada componente

### Componentes Principais
- **Simulador.jsx**: Página de simulação com exportação Excel
- **Form.jsx**: Formulário de criação/edição de contratos
- **ListaContratos.jsx**: Tabela de gerenciamento de contratos
- **Contract.jsx**: Visualização de cálculos do contrato
- **ContractContext.jsx**: Gerenciamento de estado global

## 📝 Estrutura do Projeto

```
ELECTRON_REACT_SETUP/
├── src/
│   ├── components/         # Componentes React
│   ├── contexts/           # Context API
│   ├── styles/             # Tema e estilos globais
│   ├── main.js             # Processo principal Electron
│   ├── preload.js          # Bridge IPC
│   └── renderer.jsx        # Entry point React
├── docs/                   # Documentação
├── package.json
└── *.config.mjs            # Configurações Vite/Forge
```

## 🔒 Segurança

- ✅ Context Isolation habilitado
- ✅ Node Integration desabilitado
- ✅ Comunicação IPC via contextBridge
- ✅ DevTools apenas em desenvolvimento

## 📊 Versões

### v1.1.0 (TaxiCalc Pro) - 15/02/2026
- ✨ Simulador de corridas com exportação Excel
- ✨ Edição de contratos
- 🎨 Design corporativo profissional
- 🛠️ Melhorias de UI/UX
- 📝 PageHeader com breadcrumbs
- 🔍 Submenu interativo

### v1.0.0 - 14/02/2026
- Versão inicial
- Criação de contratos
- Visualização de cálculos
- Lista de contratos

## 👤 Autor

**Gabrielbrta**

## 📝 Licença

Este projeto é privado e de uso interno.