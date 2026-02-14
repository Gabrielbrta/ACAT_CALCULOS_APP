# Form.jsx - Formulário de Criação de Contratos

## 📍 Localização
`src/components/Form.jsx`

## 🎯 Função
Criar e validar novos contratos com formulário interativo e animado.

## 📦 Dependências
```javascript
import React from 'react';
import styled from 'styled-components';
import z from 'zod';
import Btn from './Button';
import { Subtitle } from './Title';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useContract } from '../contexts/ContractContext';
```

## 🎨 Features Visuais

### Animação de Toggle
O formulário pode ser aberto/fechado com animação:

```css
@keyframes hideMenu {
    0% {
        visibility: hidden;
        width: 100%;
    } 100% {
        visibility: visible;
        width: 80px;
    }
}
```

**Estados**:
- **Aberto**: Formulário completo visível (300px)
- **Fechado**: Apenas botão de toggle visível (80px)

## ✅ Validação (Zod Schema)

### Schema de Validação
```javascript
const schema = z.object({
    // Nome do contrato
    nomeContrato: z.string()
        .min(2, 'Campo Obrigatório')
        .max(30, 'Campo Obrigatório'),
    
    // Bandeira 1 (obrigatório)
    bandeira1: z.string()
        .max(5, 'Somente 5 caracteres')
        .min(1, 'Minimo de 4 caracteres')
        .regex(/^\d{1,2},\d{2}$/, "formato 0,00 ou 00,00"),
    
    bandeirada1: z.string()
        .max(4, 'Somente 5 caracteres')
        .min(1, 'Minimo de 4 caracteres')
        .regex(/^\d{1,2},\d{2}$/, "formato 0,00 ou 00,00"),
    
    desconto1: z.string().optional(),
    
    // Bandeira 2 (condicional)
    hasBandeira2: z.boolean(),
    bandeira2: z.string(),
    bandeirada2: z.string(),
    desconto2: z.string().optional(),
})
```

### Validação Condicional (superRefine)
```javascript
.superRefine((values, ctx) => {
    let regex = /^\d{1,2},\d{2}$/;

    // Valida bandeira2 apenas se hasBandeira2 = true
    if(!regex.test(values.bandeira2) && values.hasBandeira2) {
        ctx.addIssue({
            path: ['bandeira2'],
            code: 'invalid_element',
            message: "formato 0,00 ou 00,00"
        });
    }
    
    // Mesma validação para bandeirada2
    if(!regex.test(values.bandeirada2) && values.hasBandeira2) {
        ctx.addIssue({
            path: ['bandeirada2'],
            code: 'invalid_element',
            message: "formato 0,00 ou 00,00"
        })
    }
})
```

### Transformação de Dados
```javascript
.transform((fields) => ({
    hasBandeira2: fields.hasBandeira2,
    nomeContrato: fields.nomeContrato,
    
    // Converte "3,54" → 3.54
    bandeira1: Number(fields.bandeira1.replace(",", ".")),
    bandeirada1: Number(fields.bandeirada1.replace(",", ".")),
    
    // Desconto: "10" → 10 ou false
    desconto1: fields.desconto1 
        ? Number(fields.desconto1.replace(",", ".").replace("%", ""))
        : false,
    
    // Bandeira 2: só transforma se hasBandeira2 = true
    bandeira2: fields.hasBandeira2 && fields.bandeira2 
        ? Number(fields.bandeira2.replace(",", "."))
        : false,
    bandeirada2: fields.hasBandeira2 && fields.bandeirada2 
        ? Number(fields.bandeirada2.replace(",", "."))
        : false,
    desconto2: fields.desconto2 
        ? Number(fields.desconto2.replace(",", ".").replace("%", ""))
        : false
}));
```

## 📝 React Hook Form

### Setup
```javascript
const {
    register,
    handleSubmit,
    formState: {errors},
    watch,
    reset
} = useForm({
    mode:'all',              // Valida em tempo real
    criteriaMode: 'all',     // Mostra todos os erros
    resolver: zodResolver(schema),
    defaultValues: {
        nomeContrato: '',
        bandeira1: '',
        bandeirada1: '',
        desconto1: '',
        hasBandeira2: false,
        bandeira2: '',
        bandeirada2: '',
        desconto2: '',
    }
});
```

### Watch para Condicional
```javascript
const hasBandeira2 = watch('hasBandeira2')

// Renderiza campos de bandeira 2 apenas se checkbox marcado
{hasBandeira2 && (
    <>
        <label>Bandeira 2</label>
        <input {...register('bandeira2')} />
    </>
)}
```

## 🔄 Submit do Formulário

```javascript
const handleSubmitForm = async (data) => {
    await saveContrato(data);  // Salva via Context
    reset();                   // Limpa formulário
}
```

**Fluxo**:
1. Usuário preenche formulário
2. Clica em "Criar Contrato"
3. Validação (Zod)
4. Se válido: transforma dados
5. Chama `saveContrato(data)`
6. Context salva via IPC
7. Lista de contratos atualiza automaticamente
8. Formulário é resetado

## 🎨 Estrutura do Formulário

### Campos Obrigatórios
- **Nome do Contrato**: Texto, 2-30 caracteres
- **Bandeira 1**: Formato 0,00 ou 00,00
- **Bandeirada 1**: Formato 0,00 ou 00,00

### Campos Opcionais
- **Desconto 1**: Número ou vazio

### Campos Condicionais
- **Checkbox**: "Tem Bandeira 2"
- **Bandeira 2**: Só aparece se checkbox marcado
- **Bandeirada 2**: Só aparece se checkbox marcado
- **Desconto 2**: Só aparece se checkbox marcado

## 🎨 Estilos

### Container
```javascript
const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    overflow-y: auto;
    height: 100%;
    background-color: ${({theme}) => theme.color.bgColorElements};
    padding: 20px 15px;
    border-radius: 15px 0px 0px 15px;
    position: relative;
    
    &.closed {
        animation: forwards hideMenu .5s;
        justify-self: self-end;
        form { opacity: 0; }
        h2 { opacity: 0; }
    }
`
```

### Inputs
```javascript
input {
    width: 100%;
    padding: ${({theme}) => theme.spacing.inputPadding};
    border-radius: 5px;
    border: 1px solid #acacac;
    font-size: ${({theme}) => theme.text.textSize};
}
```

### Erros de Validação
```javascript
.error {
    color: #d42d2d;
    font-size: .875rem;
}
```

## 🔗 Integração com Context

```javascript
const { saveContrato } = useContract();

const handleSubmitForm = async (data) => {
    await saveContrato(data);  // Context salva e recarrega lista
    reset();                   // Limpa formulário
}
```

**Benefício**: Não precisa gerenciar estado de contratos localmente.

## 📊 Fluxo Completo

```
Usuário preenche formulário
  ↓
Submit (handleSubmit)
  ↓
Validação Zod
  ↓ (se válido)
Transformação de dados (strings → numbers)
  ↓
handleSubmitForm(transformedData)
  ↓
useContract().saveContrato(data)
  ↓
ContractContext → window.Api.SalvarContrato
  ↓
Preload → IPC → Main process
  ↓
Salva em contratos.json
  ↓
ContractContext.loadContratos()
  ↓
Menu e List re-renderizam com novo contrato
  ↓
reset() → formulário limpo
```

## 🎯 Exemplos de Dados

### Input do Usuário
```javascript
{
  nomeContrato: "Petrobras",
  bandeira1: "3,54",
  bandeirada1: "5,50",
  desconto1: "10",
  hasBandeira2: true,
  bandeira2: "4,32",
  bandeirada2: "6,00",
  desconto2: "15"
}
```

### Após Transformação
```javascript
{
  nomeContrato: "Petrobras",
  bandeira1: 3.54,
  bandeirada1: 5.50,
  desconto1: 10,
  hasBandeira2: true,
  bandeira2: 4.32,
  bandeirada2: 6.00,
  desconto2: 15
}
```

### Salvo no JSON
```javascript
{
  id: 1707943200000,  // ← ID adicionado pelo main.js
  nomeContrato: "Petrobras",
  bandeira1: 3.54,
  bandeirada1: 5.50,
  desconto1: 10,
  hasBandeira2: true,
  bandeira2: 4.32,
  bandeirada2: 6.00,
  desconto2: 15
}
```

## 🛠️ Melhorias Futuras

- [ ] Adicionar preview do contrato antes de salvar
- [ ] Implementar debounce na validação
- [ ] Adicionar máscara automática para inputs (0,00)
- [ ] Mostrar feedback visual de sucesso ao salvar
- [ ] Adicionar confirmação antes de fechar form com dados
- [ ] Implementar modo edição de contrato existente
- [ ] Adicionar validação de contrato duplicado

---

**Tipo**: Smart Component  
**Pattern**: Controlled Form  
**Validação**: Zod + react-hook-form  
**Integração**: Context API
