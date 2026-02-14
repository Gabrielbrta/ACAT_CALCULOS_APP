# ContractContext.jsx - Context API

## 📍 Localização
`src/contexts/ContractContext.jsx`

## 🎯 Função
Gerenciar o estado global de contratos da aplicação, eliminando prop drilling e centralizando a lógica de negócio.

## 📦 Dependências
```javascript
import React, { createContext, useContext, useState, useEffect } from 'react';
```

## 🏗️ Estrutura

### Context Provider
```javascript
export const ContractProvider = ({ children }) => {
  // Estado e lógica
}
```

### Custom Hook
```javascript
export const useContract = () => {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error('useContract deve ser usado dentro de ContractProvider');
  }
  return context;
}
```

## 📊 Estado Gerenciado

### 1. contratos
**Tipo**: `Array<Contrato>`  
**Inicial**: `[]`

```javascript
const [contratos, setContratos] = useState([]);
```

**Estrutura de um Contrato**:
```typescript
{
  id: number,              // Timestamp único
  nomeContrato: string,    // Nome do contrato
  bandeira1: number,       // Valor por km bandeira 1
  bandeirada1: number,     // Valor fixo bandeira 1
  desconto1: number | false, // Desconto % ou false
  hasBandeira2: boolean,   // Tem bandeira 2?
  bandeira2: number | false, // Valor por km bandeira 2
  bandeirada2: number | false, // Valor fixo bandeira 2
  desconto2: number | false  // Desconto % bandeira 2
}
```

### 2. cardContent
**Tipo**: `string | number`  
**Inicial**: `""`

```javascript
const [cardContent, setCardContent] = useState("");
```

Armazena o ID do contrato selecionado.

## 🔧 Métodos Expostos

### 1. loadContratos()
**Tipo**: `async () => void`

```javascript
const loadContratos = async () => {
  const data = await window.Api.PegarContratos();
  setContratos(data);
};
```

**Função**: Busca contratos do IPC e atualiza estado.

**Quando é chamado**:
- Na inicialização (useEffect)
- Após salvar novo contrato

### 2. saveContrato(data)
**Tipo**: `async (data: Contrato) => void`

```javascript
const saveContrato = async (data) => {
  await window.Api.SalvarContrato(data);
  await loadContratos();
};
```

**Função**: Salva contrato via IPC e recarrega lista.

**Fluxo**:
1. Envia dados para main process
2. Aguarda salvamento
3. Recarrega lista atualizada

### 3. getContratoById(id)
**Tipo**: `(id: number) => Contrato | undefined`

```javascript
const getContratoById = (id) => {
  return contratos.find(c => c.id === id);
};
```

**Função**: Busca contrato específico por ID.

**Uso**:
```javascript
const { getContratoById } = useContract();
const contrato = getContratoById(1707943200000);
```

### 4. setCardContent(id)
**Tipo**: `(id: string | number) => void`

Setter do estado `cardContent`.

## 🔄 Ciclo de Vida

### Inicialização
```javascript
useEffect(() => {
  loadContratos();
}, []);
```

Carrega contratos assim que o Provider monta.

## 📡 Context Value

```javascript
<ContractContext.Provider 
  value={{
    contratos,           // Array de contratos
    cardContent,         // ID do contrato selecionado
    setCardContent,      // Função para selecionar
    saveContrato,        // Função para salvar
    loadContratos,       // Função para recarregar
    getContratoById,     // Função para buscar
  }}
>
  {children}
</ContractContext.Provider>
```

## 🎣 Como Usar (useContract)

### Em Componentes
```javascript
import { useContract } from '../contexts/ContractContext';

const MeuComponente = () => {
  const { 
    contratos, 
    cardContent, 
    setCardContent,
    saveContrato,
    getContratoById 
  } = useContract();
  
  // Use os dados e métodos...
}
```

### Exemplos de Uso

#### Listar Contratos
```javascript
const { contratos } = useContract();

return (
  <ul>
    {contratos.map(c => (
      <li key={c.id}>{c.nomeContrato}</li>
    ))}
  </ul>
);
```

#### Selecionar Contrato
```javascript
const { setCardContent } = useContract();

<button onClick={() => setCardContent(123)}>
  Selecionar
</button>
```

#### Salvar Contrato
```javascript
const { saveContrato } = useContract();

const handleSubmit = async (data) => {
  await saveContrato(data);
  // Lista é recarregada automaticamente
};
```

#### Buscar Contrato
```javascript
const { cardContent, getContratoById } = useContract();
const contrato = cardContent ? getContratoById(cardContent) : null;

if (contrato) {
  return <div>{contrato.nomeContrato}</div>;
}
```

## 🔗 Relacionamentos

### Usado por:
- **Home.jsx**: Envolve filhos no Provider
- **Menu.jsx**: Acessa contratos
- **List.jsx**: Acessa contratos e setCardContent
- **Contract.jsx**: Acessa cardContent e getContratoById
- **Form.jsx**: Usa saveContrato

### Depende de:
- **window.Api**: Para comunicação IPC
- **main.js**: Para persistência de dados

## 📊 Fluxo de Dados

### Salvar Novo Contrato
```
Form.jsx (submit)
  ↓
useContract().saveContrato(data)
  ↓
window.Api.SalvarContrato(data)
  ↓
main.js salva em JSON
  ↓
loadContratos()
  ↓
window.Api.PegarContratos()
  ↓
setContratos(newData)
  ↓
Re-render automático de todos os componentes que usam useContract()
```

### Selecionar Contrato
```
List.jsx (click)
  ↓
setCardContent(id)
  ↓
Context atualiza cardContent
  ↓
Contract.jsx re-renderiza
  ↓
getContratoById(cardContent)
  ↓
Card.jsx exibe dados
```

## 🎯 Benefícios

### Antes (Prop Drilling)
```javascript
// Home.jsx
const [contratos, setContratos] = useState([]);
<Menu contratos={contratos} setContratos={setContratos} />

// Menu.jsx
<List contratos={props.contratos} setContratos={props.setContratos} />

// List.jsx
props.contratos.map(...)
```

### Depois (Context API)
```javascript
// Home.jsx
<Menu />

// Menu.jsx
<List />

// List.jsx
const { contratos } = useContract();
contratos.map(...)
```

## ⚠️ Considerações

### Performance
- Context re-renderiza todos os consumidores quando o valor muda
- Para otimizar, pode-se dividir em múltiplos contexts:
  - ContractDataContext (contratos)
  - ContractSelectionContext (cardContent)

### Error Handling
```javascript
if (!context) {
  throw new Error('useContract deve ser usado dentro de ContractProvider');
}
```

Garante que o hook só seja usado dentro do Provider.

## 🛠️ Melhorias Futuras

- [ ] Adicionar loading state
- [ ] Adicionar error state
- [ ] Implementar cache de contratos
- [ ] Adicionar método updateContrato
- [ ] Adicionar método deleteContrato
- [ ] Implementar undo/redo
- [ ] Adicionar otimização com useMemo/useCallback

---

**Tipo**: Context Provider + Custom Hook  
**Linguagem**: JavaScript (React)  
**Pattern**: Context API + Custom Hook  
**Dependências**: React, window.Api (Electron IPC)
