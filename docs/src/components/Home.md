# Home.jsx - Layout Principal

## 📍 Localização
`src/components/Home.jsx`

## 🎯 Função
Definir o layout principal da aplicação usando CSS Grid.

## 📦 Dependências
```javascript
import React from 'react'
import styled from 'styled-components';
import Menu from './Menu';
import Form from './Form';
import Contract from './Contract';
```

## 🎨 Layout Grid

### Estrutura Visual
```
┌──────────┬─────────────────┬──────────┐
│  Menu    │    Contract     │   Form   │
│  280px   │   1fr (flex)    │  300px   │
│          │                 │          │
│  Sidebar │   Área Central  │ Sidebar  │
│  Esquerda│   (Principal)   │ Direita  │
└──────────┴─────────────────┴──────────┘
```

### CSS Grid Configuration
```javascript
const Main = styled.main`
    width: 100%;
    height: 100vh;
    display:grid;
    grid-template-columns: 280px 1fr 300px;
`
```

**Explicação**:
- **280px**: Largura fixa do Menu
- **1fr**: Contract ocupa todo espaço restante
- **300px**: Largura fixa do Form

## 📝 Código
```javascript
const Home = () => {
  return (
    <Main>
        <Menu />
        <Contract />
        <Form />
    </Main>
  )
}
```

## 🔄 Antes vs Depois

### ❌ Antes (Prop Drilling)
```javascript
const Home = () => {
  const [contratos, setContratos] = useState([]);
  const [cardContent, setCardContent] = useState("");

  useEffect(() => {
    window.Api.PegarContratos().then(contratos => setContratos(contratos));
  }, []); 

  return (
    <Main>
        <Menu contratos={contratos} setCardContent={setCardContent}/>
        <Contract idContrato={cardContent} setCardContent={setCardContent} />
        <Form setContratos={setContratos}/>
    </Main>
  )
}
```

### ✅ Depois (Context API)
```javascript
const Home = () => {
  return (
    <Main>
        <Menu />
        <Contract />
        <Form />
    </Main>
  )
}
```

**Benefícios**:
- Código mais limpo
- Sem estado local
- Sem props
- Mais fácil de manter

## 🔗 Componentes Filhos

### Menu (Esquerda)
- Lista de contratos
- Funcionalidades (Simulador)
- Navegação

### Contract (Centro)
- Visualização do contrato selecionado
- Card com cálculos
- Área principal de trabalho

### Form (Direita)
- Criação de novos contratos
- Validação de formulário
- Animação de abrir/fechar

## 📱 Responsividade

**Estado Atual**: Layout fixo para desktop

**Melhorias Futuras**:
```css
@media (max-width: 1024px) {
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr auto;
}
```

## 🎨 Estilização

### Sem Estilos Visuais
O componente Home não aplica cores, padding ou outros estilos visuais. Apenas define o layout grid.

### Estilos dos Filhos
Cada componente filho é responsável por sua própria estilização:
- Menu: background, padding, etc.
- Contract: centralização, gap
- Form: background, border-radius

## 🔗 Relacionamentos

### Componentes Filhos:
- **Menu**: Sidebar esquerda
- **Contract**: Área central
- **Form**: Sidebar direita

### Usado por:
- **renderer.jsx**: Via React Router

### Depende de:
- **ContractContext**: Envolvido no Provider (renderer.jsx)

## 📊 Fluxo de Renderização

```
renderer.jsx (ContractProvider)
  ↓
Router (path="/")
  ↓
Home.jsx (Grid Layout)
  ↓
├── Menu.jsx
├── Contract.jsx
└── Form.jsx
     ↓
Todos usam useContract() para acessar dados
```

## 🛠️ Variações Possíveis

### Layout Vertical (Mobile)
```javascript
const Main = styled.main`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr auto;
  
  @media (min-width: 768px) {
    grid-template-columns: 280px 1fr 300px;
    grid-template-rows: 1fr;
  }
`
```

### Layout com Header
```javascript
const Main = styled.main`
  display: grid;
  grid-template-areas:
    "header header header"
    "menu content form"
    "footer footer footer";
  grid-template-columns: 280px 1fr 300px;
  grid-template-rows: auto 1fr auto;
`
```

## 🎯 Design Pattern

### Container Component
- **Responsabilidade**: Apenas layout
- **Não tem**: Lógica de negócio, estado, side effects
- **Tem**: Estrutura visual, composição de componentes

### Benefícios:
- Separação de responsabilidades
- Fácil de testar
- Fácil de modificar layout

## 🛠️ Melhorias Futuras

- [ ] Adicionar responsividade para mobile/tablet
- [ ] Implementar layout dinâmico (redimensionável)
- [ ] Adicionar animações de transição
- [ ] Implementar diferentes layouts (vertical, horizontal)
- [ ] Adicionar header/footer
- [ ] Implementar temas (light/dark)

---

**Tipo**: Container Component  
**Pattern**: Presentational Component  
**Responsabilidade**: Layout Grid  
**Estado**: Nenhum (stateless)
