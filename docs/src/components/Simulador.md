# Simulador.jsx - Simulador de Corridas com Exportação Excel

## 📍 Localização
`src/components/Simulador.jsx`

## 🎯 Função
Simular corridas de táxi/transporte com parâmetros personalizados e exportar relatório para Excel com formatação profissional.

## 📦 Dependências
```javascript
import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import * as XLSX from 'xlsx-js-style';
import PageHeader from './PageHeader';
import { toast } from 'react-toastify';
```

## ✨ Features Principais

### 1. **Dois Modos de Simulação**
#### KM Variado
- Define range (mínimo e máximo) de KM por corrida
- Gera valores aleatórios dentro do range
- Exporta planilha detalhada com cada corrida
- Calcula média de KM e total

#### KM Fixo
- Define um único valor de KM para todas as corridas
- Exporta planilha resumida (sem detalhamento)
- Mostra apenas totais e quantidade

### 2. **Parâmetros Configuráveis**
- **Nome do Contrato**: Identificação da simulação
- **Bandeira**: Valor por KM (R$)
- **Bandeirada**: Taxa fixa inicial (R$)
- **Desconto**: Percentual de desconto (0-100%)
- **KM**: Variado (min/max) ou Fixo
- **Quantidade de Corridas**: Até 10.000 corridas

### 3. **Exportação Excel Estilizada**
#### Cores Corporativas
- **Título**: Fundo azul escuro (#1E3A5F) + texto branco
- **Cabeçalhos**: Fundo azul médio (#2C5282) + texto branco
- **Dados (linhas alternadas)**: 
  - Pares: Fundo azul claro (#E3F2FD)
  - Ímpares: Fundo branco
- **Resumo**: Fundo verde (#2D7A3E, #D5E8D4, #E8F5E9)

#### Formatação
- Bordas em todas as células
- Larguras de coluna otimizadas
- Altura aumentada no título
- Mescla de células no título e resumo
- Valores monetários com prefixo "R$"
- Valores de distância com sufixo "km"

## 🎨 Estados Locais

### isGenerating
**Tipo**: `boolean`  
**Inicial**: `false`

Controla o estado de carregamento durante geração do Excel.

```jsx
<button disabled={isGenerating}>
  {isGenerating ? 'Gerando...' : 'Gerar Excel'}
</button>
```

### tipoKm
**Tipo**: `'variado' | 'fixo'`  
**Inicial**: `'variado'`

Define o modo de simulação (KM variado ou fixo).

## ✅ Validação (Schema Dinâmico)

### createSchema(tipoKm)
Retorna schema Zod baseado no tipo selecionado.

#### Campos Base (ambos os modos)
```javascript
nomeContrato: z.string().min(2).max(50),
tipoKm: z.enum(['variado', 'fixo']),
bandeira: z.string().regex(/^\d{1,2}(,\d{1,2})?$/),
bandeirada: z.string().regex(/^\d{1,2}(,\d{1,2})?$/),
desconto: z.string()
  .regex(/^\d{1,2}(,\d{1,2})?$/)
  .refine(val => {
    const num = parseFloat(val.replace(',', '.'));
    return num >= 0 && num <= 100;
  }, 'Desconto deve estar entre 0 e 100'),
quantidadeCorridas: z.string()
  .refine(val => !isNaN(parseInt(val)))
  .refine(val => parseInt(val) > 0)
  .refine(val => parseInt(val) <= 10000)
```

#### Modo Variado
```javascript
kmMinimo: z.string()
  .min(1)
  .refine(val => !isNaN(Number(val.replace(',', '.')))),
kmMaximo: z.string()
  .min(1)
  .refine(val => !isNaN(Number(val.replace(',', '.'))))
```

#### Modo Fixo
```javascript
kmFixo: z.string()
  .min(1)
  .refine(val => !isNaN(Number(val.replace(',', '.'))))
  .refine(val => parseFloat(val.replace(',', '.')) > 0)
```

## 🎭 Máscaras de Input

### handleMoneyMask
```javascript
const handleMoneyMask = (e) => {
  let value = e.target.value;
  value = value.replace(/[^\d,]/g, '');
  const parts = value.split(',');
  if (parts.length > 2) {
    value = parts[0] + ',' + parts.slice(1).join('');
  }
  e.target.value = value;
};
```

**Formato**: `3,54` ou `10,50`  
**Uso**: Bandeira, bandeirada, desconto

### handleDecimalMask
```javascript
const handleDecimalMask = (e) => {
  let value = e.target.value;
  value = value.replace(/[^\d,]/g, '');
  const parts = value.split(',');
  if (parts.length > 2) {
    value = parts[0] + ',' + parts.slice(1).join('');
  }
  e.target.value = value;
};
```

**Formato**: `25,5` ou `10`  
**Uso**: KM mínimo, máximo, fixo

### handleIntegerMask
```javascript
const handleIntegerMask = (e) => {
  let value = e.target.value.replace(/\D/g, '');
  e.target.value = value;
};
```

**Formato**: Apenas números inteiros  
**Uso**: Quantidade de corridas

## 🔧 Funções de Cálculo

### gerarCorridas(kmMin, kmMax, quantidade)
```javascript
const gerarCorridas = (kmMin, kmMax, quantidade) => {
  const corridas = [];
  for (let i = 1; i <= quantidade; i++) {
    const km = Math.random() * (kmMax - kmMin) + kmMin;
    corridas.push({
      numero: i,
      km: parseFloat(km.toFixed(2))
    });
  }
  return corridas;
};
```

**Retorno**: Array de objetos `{ numero, km }`

### calcularValorCorrida(km, bandeira, bandeirada, desconto)
```javascript
const calcularValorCorrida = (km, bandeira, bandeirada, desconto) => {
  const valorBase = (km * bandeira) + bandeirada;
  const valorDesconto = valorBase * (desconto / 100);
  return valorBase - valorDesconto;
};
```

**Fórmula**:
1. Valor Base = (KM × Bandeira) + Bandeirada
2. Valor Desconto = Valor Base × (Desconto ÷ 100)
3. Valor Final = Valor Base - Valor Desconto

## 📊 Exportação Excel

### exportarParaExcel(dados, nomeContrato, tipoKm)

#### Estrutura KM Variado
```
┌─────────────────────────────────────────┐
│ Simulação de Corridas - [Nome]         │ ← Título (merge 3 colunas)
├─────────────┬─────────────┬─────────────┤
│ Corrida     │ KM          │ Valor (R$)  │ ← Cabeçalho
├─────────────┼─────────────┼─────────────┤
│ 1           │ 12,50       │ R$ 49,75    │ ← Linha par (azul claro)
│ 2           │ 18,30       │ R$ 70,12    │ ← Linha ímpar (branco)
│ ...         │ ...         │ ...         │
├─────────────┴─────────────┴─────────────┤
│ RESUMO                                  │ ← Título resumo (verde)
├─────────────────────────┬───────────────┤
│ Média de KM:            │ 15,40         │
│ Total de Corridas:      │ 100           │
│ Total em R$:            │ R$ 5.993,50   │
└─────────────────────────┴───────────────┘
```

#### Estrutura KM Fixo
```
┌──────────────────────────────────────────┐
│ Simulação de Corridas - [Nome]          │
│ Tipo: KM Fixo                            │
├──────────────────────────────────────────┤
│ RESUMO DA SIMULAÇÃO                      │
├────────────────────────────┬─────────────┤
│ Quantidade de Corridas:    │ 100         │
│ KM por Corrida:            │ 25,00 km    │
│ KM Total:                  │ 2.500,00 km │
│ Valor por Corrida:         │ R$ 93,25    │
│ Valor Total:               │ R$ 9.325,00 │
└────────────────────────────┴─────────────┘
```

#### Estilos Aplicados

```javascript
// Título
{
  font: { bold: true, sz: 16, color: { rgb: "FFFFFF" } },
  fill: { patternType: "solid", fgColor: { rgb: "1E3A5F" } },
  alignment: { horizontal: "center", vertical: "center" },
  border: { /* bordas pretas */ }
}

// Cabeçalho
{
  font: { bold: true, sz: 11, color: { rgb: "FFFFFF" } },
  fill: { patternType: "solid", fgColor: { rgb: "2C5282" } },
  alignment: { horizontal: "center", vertical: "center" },
  border: { /* bordas pretas */ }
}

// Dados (linhas pares)
{
  fill: { patternType: "solid", fgColor: { rgb: "E3F2FD" } },
  alignment: { horizontal: "center", vertical: "center" },
  border: { /* bordas cinza */ }
}

// Dados (linhas ímpares)
{
  fill: { patternType: "solid", fgColor: { rgb: "FFFFFF" } },
  alignment: { horizontal: "center", vertical: "center" },
  border: { /* bordas cinza */ }
}

// Resumo - Label
{
  font: { bold: true, sz: 10 },
  fill: { patternType: "solid", fgColor: { rgb: "D5E8D4" } },
  alignment: { horizontal: "left", vertical: "center" },
  border: { /* bordas cinza */ }
}

// Resumo - Valor
{
  font: { sz: 10, bold: true },
  fill: { patternType: "solid", fgColor: { rgb: "E8F5E9" } },
  alignment: { horizontal: "right", vertical: "center" },
  border: { /* bordas cinza */ }
}
```

## 🔄 Fluxo de Submissão

```javascript
const onSubmit = (data) => {
  setIsGenerating(true);
  
  try {
    // 1. Parse dos valores
    const bandeira = parseFloat(data.bandeira.replace(',', '.'));
    const bandeirada = parseFloat(data.bandeirada.replace(',', '.'));
    const desconto = parseFloat(data.desconto.replace(',', '.'));
    const quantidadeCorridas = parseInt(data.quantidadeCorridas);

    let dadosExportacao;

    if (data.tipoKm === 'variado') {
      // 2a. KM Variado - gerar array de corridas
      const kmMinimo = parseFloat(data.kmMinimo.replace(',', '.'));
      const kmMaximo = parseFloat(data.kmMaximo.replace(',', '.'));
      
      const corridas = gerarCorridas(kmMinimo, kmMaximo, quantidadeCorridas);
      
      const corridasComValor = corridas.map(corrida => ({
        ...corrida,
        valor: calcularValorCorrida(corrida.km, bandeira, bandeirada, desconto)
      }));

      const totalKm = corridasComValor.reduce((acc, c) => acc + c.km, 0);
      const totalValor = corridasComValor.reduce((acc, c) => acc + c.valor, 0);
      const mediaKm = totalKm / quantidadeCorridas;

      dadosExportacao = {
        corridas: corridasComValor,
        mediaKm,
        totalCorridas: quantidadeCorridas,
        totalEmReais: totalValor
      };
    } else {
      // 2b. KM Fixo - calcular totais diretamente
      const kmFixo = parseFloat(data.kmFixo.replace(',', '.'));
      const valorPorCorrida = calcularValorCorrida(kmFixo, bandeira, bandeirada, desconto);
      const kmTotal = kmFixo * quantidadeCorridas;
      const totalEmReais = valorPorCorrida * quantidadeCorridas;

      dadosExportacao = {
        kmFixo,
        valorPorCorrida,
        kmTotal,
        totalCorridas: quantidadeCorridas,
        totalEmReais
      };
    }

    // 3. Exportar para Excel
    exportarParaExcel(dadosExportacao, data.nomeContrato, data.tipoKm);
    
    // 4. Feedback e reset
    toast.success('Excel gerado com sucesso!', { icon: '📊' });
    setTimeout(() => {
      reset();
      setTipoKm('variado');
    }, 500);

  } catch (error) {
    console.error('Erro ao gerar simulação:', error);
    toast.error('Erro ao gerar simulação!');
  } finally {
    setIsGenerating(false);
  }
};
```

## 🎨 Interface do Usuário

### Componentes Principais

#### Radio Buttons (Tipo de KM)
```jsx
<RadioGroup>
  <RadioOption checked={tipoKm === 'variado'}>
    <input 
      type="radio" 
      value="variado"
      checked={tipoKm === 'variado'}
      onChange={(e) => handleTipoKmChange(e.target.value)}
    />
    <span>KM Variado</span>
  </RadioOption>
  <RadioOption checked={tipoKm === 'fixo'}>
    <input 
      type="radio" 
      value="fixo"
      checked={tipoKm === 'fixo'}
      onChange={(e) => handleTipoKmChange(e.target.value)}
    />
    <span>KM Fixo</span>
  </RadioOption>
</RadioGroup>
```

**Estilo**: Borda destaque na opção selecionada, fundo azul claro.

#### Campos Condicionais
```jsx
{tipoKm === 'variado' ? (
  <InputRow>
    <InputGroup>
      <label>KM Mínimo por Corrida *</label>
      <input {...register('kmMinimo')} />
    </InputGroup>
    <InputGroup>
      <label>KM Máximo por Corrida *</label>
      <input {...register('kmMaximo')} />
    </InputGroup>
  </InputRow>
) : (
  <InputGroup>
    <label>KM por Corrida (Fixo) *</label>
    <input {...register('kmFixo')} />
  </InputGroup>
)}
```

#### Botão de Submissão
```jsx
<SubmitButton type="submit" disabled={isGenerating}>
  {isGenerating ? (
    <>
      <i className="fa-solid fa-spinner fa-spin"></i>
      Gerando...
    </>
  ) : (
    <>
      <i className="fa-solid fa-file-excel"></i>
      Gerar Excel
    </>
  )}
</SubmitButton>
```

## 📐 Layout

### Organização por Seções
1. **Cabeçalho**: Botão voltar + breadcrumbs
2. **Nome do Contrato**: Campo único
3. **Parâmetros do Cálculo**: Bandeira, bandeirada, desconto
4. **Parâmetros de Distância**: Radio + campos KM
5. **Quantidade de Corridas**: Campo numérico
6. **Ação**: Botão de geração

### Dividers
Separadores visuais entre cada seção.

## 🔐 Validações Especiais

### KM Mínimo < KM Máximo
```javascript
if (kmMinimo >= kmMaximo) {
  toast.error('KM mínimo deve ser menor que KM máximo!');
  setIsGenerating(false);
  return;
}
```

### Limite de Corridas
- Mínimo: 1 corrida
- Máximo: 10.000 corridas

### Desconto
- Mínimo: 0%
- Máximo: 100%

## 🛠️ Tecnologias Utilizadas

- **xlsx-js-style**: Exportação Excel com estilos completos
- **react-hook-form**: Gerenciamento de formulário
- **zod**: Validação de schema
- **styled-components**: Estilização CSS-in-JS
- **react-toastify**: Notificações
- **react-router-dom**: Navegação

## 📦 Arquivo Gerado

### Nome do Arquivo
```javascript
`Simulacao_${nomeContrato.replace(/\s+/g, '_')}_${new Date().getTime()}.xlsx`
```

**Exemplo**: `Simulacao_Petrobras_1708023456789.xlsx`

### Localização
Download automático na pasta padrão do navegador.

## 🌟 Diferenciais

1. **Dois modos de operação** (variado/fixo) com UI adaptativa
2. **Validação robusta** com feedback em tempo real
3. **Excel profissional** com cores corporativas e bordas
4. **Máscaras de input** para melhor UX
5. **Performance otimizada** para até 10.000 corridas
6. **Feedback visual** durante geração (loading state)
7. **Reset automático** após exportação bem-sucedida

## 🔗 Navegação

**Rota**: `/simulador`

**Acesso**: Via menu lateral (Menu.jsx)

**Botão Voltar**: Retorna para home (`/`)

## 📝 Exemplo de Uso

1. Acessar simulador via menu
2. Preencher nome: "Simulação Petrobras"
3. Configurar parâmetros:
   - Bandeira: 3,54
   - Bandeirada: 5,50
   - Desconto: 10
4. Escolher "KM Variado"
5. Definir range: 5 a 50 km
6. Quantidade: 100 corridas
7. Clicar em "Gerar Excel"
8. Aguardar geração (1-2s)
9. Excel baixado automaticamente
10. Formulário resetado

## 🎯 Casos de Uso

- **Licitações**: Simular custos para apresentação em licitações
- **Relatórios**: Gerar relatórios de custo estimado
- **Planejamento**: Estimar custos de operação mensal
- **Comparações**: Comparar diferentes cenários (desconto, bandeira)
- **Auditorias**: Documentar cálculos para auditorias internas
