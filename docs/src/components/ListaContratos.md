# ListaContratos.jsx - Gerenciamento de Contratos

## 📍 Localização
`src/components/ListaContratos.jsx`

## 🎯 Função
Página completa para gerenciar contratos com tabela, busca, paginação e ações CRUD.

## 📦 Dependências
```javascript
import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { useContract } from '../contexts/ContractContext';
import { Title, Subtitle } from './Title';
import Btn from './Button';
import { useNavigate } from 'react-router-dom';
```

## ✨ Features

### 1. **Busca em Tempo Real**
- Campo de busca filtra por nome do contrato
- Atualização instantânea da tabela
- Reset automático para página 1 ao buscar

### 2. **Paginação**
- 10 itens por página
- Navegação entre páginas (anterior/próxima)
- Indicador de página atual
- Botões desabilitados automaticamente nos limites

### 3. **Tabela de Dados**
Colunas:
- Nome do Contrato
- Bandeira 1 (R$)
- Bandeirada 1 (R$)
- Desconto 1 (%)
- Tem Bandeira 2? (✅/❌)
- Ações

### 4. **Ações CRUD**
- **👁️ Visualizar**: Seleciona contrato e volta para home
- **✏️ Editar**: Abre modal de edição (TODO)
- **🗑️ Deletar**: Confirmação + exclusão do contrato

## 📊 Estados Locais

### searchTerm
**Tipo**: `string`  
**Inicial**: `""`

Armazena o termo de busca digitado pelo usuário.

### currentPage
**Tipo**: `number`  
**Inicial**: `1`

Controla a página atual da paginação.

## 🧮 Cálculos com useMemo

### filteredContratos
```javascript
const filteredContratos = useMemo(() => {
  if (!searchTerm) return contratos;
  
  return contratos.filter(contrato =>
    contrato.nomeContrato.toLowerCase().includes(searchTerm.toLowerCase())
  );
}, [contratos, searchTerm]);
```

**Otimização**: Só recalcula quando `contratos` ou `searchTerm` mudam.

### Paginação
```javascript
const totalPages = Math.ceil(filteredContratos.length / itemsPerPage);
const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;
const currentContratos = filteredContratos.slice(startIndex, endIndex);
```

## 🔧 Funções Principais

### handleDelete(id, nome)
```javascript
const handleDelete = async (id, nome) => {
  if (window.confirm(`Deseja realmente excluir o contrato "${nome}"?`)) {
    await deleteContrato(id);
  }
};
```

**Fluxo**:
1. Mostra confirmação com nome do contrato
2. Se confirmado: chama `deleteContrato(id)` do Context
3. Context chama IPC → main.js deleta do JSON
4. Lista recarrega automaticamente

### handleView(id)
```javascript
const handleView = (id) => {
  setCardContent(id);
  navigate('/');
};
```

**Fluxo**:
1. Seleciona contrato no Context
2. Navega para home
3. Home exibe contrato selecionado no Card

### handleEdit(contrato)
```javascript
const handleEdit = (contrato) => {
  alert('Funcionalidade de edição será implementada em breve!');
};
```

**TODO**: Implementar modal de edição.

## 🎨 Componentes Estilizados

### Container
Layout principal com padding e scroll.

### Header
Botão "Voltar" + Título da página.

### SearchBar
Input de busca full-width com focus style.

### Table
Tabela responsiva com:
- Header azul (tema)
- Linhas com hover effect
- Bordas suaves
- Box shadow

### Actions
Botões de ação:
- **View** (azul): Visualizar
- **Edit** (amarelo): Editar
- **Delete** (vermelho): Deletar

### Pagination
Controles de navegação:
- Botão "Anterior" (desabilita na página 1)
- Indicador "Página X de Y"
- Botão "Próxima" (desabilita na última página)

### EmptyState
Tela vazia quando:
- Não há contratos
- Busca não encontra resultados

## 🔄 Integração com Context

```javascript
const { contratos, deleteContrato, setCardContent } = useContract();
```

**Métodos usados**:
- `contratos`: Array de contratos
- `deleteContrato(id)`: Deleta contrato
- `setCardContent(id)`: Seleciona contrato

## 📊 Fluxo de Operações

### Buscar Contrato
```
Usuário digita no input
  ↓
setSearchTerm(value)
  ↓
useMemo recalcula filteredContratos
  ↓
setCurrentPage(1) - reset paginação
  ↓
Tabela re-renderiza com resultados filtrados
```

### Deletar Contrato
```
Usuário clica em Delete
  ↓
window.confirm("Deseja excluir...?")
  ↓ (se confirmar)
handleDelete(id, nome)
  ↓
useContract().deleteContrato(id)
  ↓
ContractContext → window.Api.DeletarContrato(id)
  ↓
Preload → IPC → main.js
  ↓
fs.writeFileSync (remove do JSON)
  ↓
ContractContext.loadContratos()
  ↓
Tabela re-renderiza sem o contrato deletado
```

### Visualizar Contrato
```
Usuário clica em View
  ↓
handleView(id)
  ↓
setCardContent(id) - Context
  ↓
navigate('/') - React Router
  ↓
Home.jsx renderiza
  ↓
Contract.jsx busca contrato por ID
  ↓
Card.jsx exibe dados
```

## 🎯 Exemplos de Uso

### Busca
```
Input: "petro"
Resultado: Filtra todos os contratos com "petro" no nome
  - "Petrobras"
  - "Petrobras Sul"
```

### Paginação
```
15 contratos totais
10 por página
= 2 páginas

Página 1: contratos 1-10
Página 2: contratos 11-15
```

## 🎨 Layout Responsivo

**Desktop**:
- Tabela com todas as colunas visíveis
- Ações lado a lado

**Melhorias Futuras (Mobile)**:
- Cards ao invés de tabela
- Ações em dropdown
- Busca sticky

## 🛠️ Melhorias Futuras

### Funcionalidades
- [ ] Implementar modal de edição de contratos
- [ ] Adicionar filtros avançados (bandeira, desconto)
- [ ] Ordenação por coluna (nome, valor, etc)
- [ ] Exportar lista para CSV/PDF
- [ ] Seleção múltipla para ações em lote
- [ ] Undo após deletar contrato
- [ ] Loading state durante operações

### UX/UI
- [ ] Toast/notification ao deletar/atualizar
- [ ] Animações de entrada/saída de linhas
- [ ] Skeleton loading durante carregamento
- [ ] Drag and drop para reordenar
- [ ] Highlight da busca nos resultados
- [ ] Modo dark

### Performance
- [ ] Virtual scrolling para listas grandes
- [ ] Debounce na busca
- [ ] Lazy loading de dados
- [ ] Cache de contratos

## 📱 Acessibilidade

**Implementado**:
- Labels descritivos em botões (title)
- Navegação por teclado (inputs, botões)
- Confirmação antes de deletar

**TODO**:
- ARIA labels
- Focus management
- Screen reader support
- Keyboard shortcuts

## 🔗 Relacionamentos

### Rotas:
- **URL**: `/contratos`
- **Navegação de**: Menu → "Gerenciar Contratos"
- **Navegação para**: 
  - `/` (Home) ao clicar "Voltar" ou "Visualizar"

### Context:
- `contratos`: Lista completa
- `deleteContrato`: Remove contrato
- `setCardContent`: Seleciona para visualização

### Componentes:
- **Title/Subtitle**: Títulos estilizados
- **Btn**: Botão (não usado diretamente, mas importado)

---

**Tipo**: Smart Component (Page)  
**Pattern**: Container com estado local + Context  
**Features**: CRUD, Busca, Paginação  
**Responsabilidade**: Gerenciamento completo de contratos
