import React, { useState } from 'react'
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import * as XLSX from 'xlsx-js-style';
import PageHeader from './PageHeader';
import { toast } from 'react-toastify';

const Container = styled.div`
  width: 100%;
  height: 100vh;
  padding: 30px;
  overflow-y: auto;
  background-color: ${({theme}) => theme.color.bgPage};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  
  .back-button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 0.9rem;
    color: ${({theme}) => theme.color.subtitle};
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    border-radius: ${({theme}) => theme.borderRadius.medium};
    transition: all 0.2s ease;
    
    &:hover {
      color: ${({theme}) => theme.color.title};
      background-color: ${({theme}) => theme.color.bgHover};
    }
  }
`;

const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
    background-color: ${({theme}) => theme.color.bgCard};
    padding: 24px;
    border-radius: ${({theme}) => theme.borderRadius.large};
    box-shadow: ${({theme}) => theme.shadow.medium};
    border: 1px solid ${({theme}) => theme.color.border};
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    width: 100%;
    
    label {
        font-weight: ${({theme}) => theme.font.wheightBold};
        color: ${({theme}) => theme.color.title};
        margin-bottom: 4px;
        display: block;
        font-size: 0.9rem;
    }
    
    input {
        width: 100%;
        padding: ${({theme}) => theme.spacing.inputPadding};
        border-radius: ${({theme}) => theme.borderRadius.medium};
        border: 1px solid ${({theme}) => theme.color.border};
        font-size: ${({theme}) => theme.text.textSize};
        transition: all 0.2s ease;
        background-color: ${({theme}) => theme.color.bgColorElements};
        color: ${({theme}) => theme.color.text};
        
        &:focus {
            outline: none;
            border-color: ${({theme}) => theme.color.primary};
            box-shadow: 0 0 0 3px rgba(30, 58, 95, 0.1);
        }
        
        &::placeholder {
            color: ${({theme}) => theme.color.textLight};
        }
    }

    .error {
        color: ${({theme}) => theme.color.danger};
        font-size: ${({theme}) => theme.text.smallSize};
        margin-top: 3px;
        display: flex;
        align-items: center;
        gap: 4px;
        
        &::before {
            content: "\\26A0";
        }
    }
`;

const InputGroup = styled.div`
    margin-bottom: 8px;

    label {
      display: flex;
      align-items: center;
      gap: 0px 5px;
    } 
`;

const InputRow = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
`;

const SubmitButton = styled.button`
    width: 100%;
    padding: 12px;
    background: ${({theme}) => theme.color.button};
    color: ${({theme}) => theme.color.buttonText};
    border: none;
    border-radius: ${({theme}) => theme.borderRadius.medium};
    font-size: 1rem;
    font-weight: ${({theme}) => theme.font.wheightBold};
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: ${({theme}) => theme.shadow.small};
    margin-top: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    
    &:hover {
        background: ${({theme}) => theme.color.buttonHover};
        transform: translateY(-1px);
        box-shadow: ${({theme}) => theme.shadow.medium};
    }
    
    &:active {
        transform: translateY(0);
    }
    
    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
    }
`;

const SectionTitle = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 5px 0 10px 0;
    
    h2 {
        font-size: 1.15rem;
        color: ${({theme}) => theme.color.title};
        margin: 0;
        font-weight: ${({theme}) => theme.font.wheightBold};
    }
    
    .icon {
        background: ${({theme}) => theme.color.primary};
        color: ${({theme}) => theme.color.textOnDark};
        width: 32px;
        height: 32px;
        border-radius: ${({theme}) => theme.borderRadius.small};
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1rem;
    }
`;

const Divider = styled.hr`
    border: none;
    border-top: 1px solid ${({theme}) => theme.color.divider};
    margin: 20px 0;
`;

const RadioGroup = styled.div`
    display: flex;
    gap: 20px;
    margin-top: 8px;
`;

const RadioOption = styled.label`
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    padding: 10px 16px;
    border-radius: ${({theme}) => theme.borderRadius.medium};
    border: 2px solid ${({theme, checked}) => checked ? theme.color.primary : theme.color.border};
    background-color: ${({theme, checked}) => checked ? 'rgba(30, 58, 95, 0.05)' : theme.color.bgColorElements};
    transition: all 0.2s ease;
    font-weight: ${({theme, checked}) => checked ? theme.font.wheightBold : 'normal'};
    color: ${({theme}) => theme.color.text};
    
    &:hover {
        border-color: ${({theme}) => theme.color.primary};
        background-color: rgba(30, 58, 95, 0.05);
    }
    
    input[type="radio"] {
        width: 18px;
        height: 18px;
        cursor: pointer;
        accent-color: ${({theme}) => theme.color.primary};
    }
`;

// Schema de validação dinâmico
const createSchema = (tipoKm) => {
  const baseSchema = {
    nomeContrato: z.string().min(2, 'Nome obrigatório').max(50, 'Máximo 50 caracteres'),
    tipoKm: z.enum(['variado', 'fixo']),
    bandeira: z.string()
        .min(1, 'Campo obrigatório')
        .max(5, 'Máximo 5 caracteres')
        .regex(/^\d{1,2}(,\d{1,2})?$/, "Use formato 0,00 (exemplo: 3,54)"),
    bandeirada: z.string()
        .min(1, 'Campo obrigatório')
        .max(5, 'Máximo 5 caracteres')
        .regex(/^\d{1,2}(,\d{1,2})?$/, "Use formato 0,00 (exemplo: 5,50)"),
    desconto: z.string()
        .min(1, 'Campo obrigatório')
        .max(5, 'Máximo 5 caracteres')
        .regex(/^\d{1,2}(,\d{1,2})?$/, "Use formato 0,00 (exemplo: 10,50)")
        .refine(val => {
            const num = parseFloat(val.replace(',', '.'));
            return num >= 0 && num <= 100;
        }, 'Desconto deve estar entre 0 e 100'),
    quantidadeCorridas: z.string()
        .min(1, 'Campo obrigatório')
        .refine(val => !isNaN(parseInt(val)), 'Deve ser um número inteiro')
        .refine(val => parseInt(val) > 0, 'Deve ser maior que zero')
        .refine(val => parseInt(val) <= 10000, 'Máximo 10.000 corridas'),
  };

  if (tipoKm === 'variado') {
    return z.object({
      ...baseSchema,
      kmMinimo: z.string()
          .min(1, 'Campo obrigatório')
          .refine(val => !isNaN(Number(val.replace(',', '.'))), 'Valor inválido'),
      kmMaximo: z.string()
          .min(1, 'Campo obrigatório')
          .refine(val => !isNaN(Number(val.replace(',', '.'))), 'Valor inválido'),
      kmFixo: z.string().optional(),
    });
  } else {
    return z.object({
      ...baseSchema,
      kmFixo: z.string()
          .min(1, 'Campo obrigatório')
          .refine(val => !isNaN(Number(val.replace(',', '.'))), 'Valor inválido')
          .refine(val => parseFloat(val.replace(',', '.')) > 0, 'Deve ser maior que zero'),
      kmMinimo: z.string().optional(),
      kmMaximo: z.string().optional(),
    });
  }
};

const Simulador = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [tipoKm, setTipoKm] = useState('variado');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue
  } = useForm({
    mode: 'all',
    resolver: zodResolver(createSchema(tipoKm)),
    defaultValues: {
      nomeContrato: '',
      tipoKm: 'variado',
      bandeira: '',
      bandeirada: '',
      desconto: '',
      kmMinimo: '',
      kmMaximo: '',
      kmFixo: '',
      quantidadeCorridas: ''
    }
  });

  const handleTipoKmChange = (tipo) => {
    setTipoKm(tipo);
    setValue('tipoKm', tipo);
    // Limpar campos não utilizados
    if (tipo === 'variado') {
      setValue('kmFixo', '');
    } else {
      setValue('kmMinimo', '');
      setValue('kmMaximo', '');
    }
  };

  // Máscara para valores monetários
  const handleMoneyMask = (e) => {
    let value = e.target.value;
    value = value.replace(/[^\d,]/g, '');
    const parts = value.split(',');
    if (parts.length > 2) {
      value = parts[0] + ',' + parts.slice(1).join('');
    }
    e.target.value = value;
  };

  // Máscara para números decimais (km)
  const handleDecimalMask = (e) => {
    let value = e.target.value;
    value = value.replace(/[^\d,]/g, '');
    const parts = value.split(',');
    if (parts.length > 2) {
      value = parts[0] + ',' + parts.slice(1).join('');
    }
    e.target.value = value;
  };

  // Máscara para números inteiros
  const handleIntegerMask = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    e.target.value = value;
  };

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

  const calcularValorCorrida = (km, bandeira, bandeirada, desconto) => {
    const valorBase = (km * bandeira) + bandeirada;
    const valorDesconto = valorBase * (desconto / 100);
    return valorBase - valorDesconto;
  };

  const exportarParaExcel = (dados, nomeContrato, tipoKm) => {
    const wb = XLSX.utils.book_new();
    
    // Estilos - cores e formatação completa
    const styleTitulo = {
      font: { bold: true, sz: 16, color: { rgb: "FFFFFF" } },
      fill: { patternType: "solid", fgColor: { rgb: "1E3A5F" } },
      alignment: { horizontal: "center", vertical: "center" },
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } }
      }
    };

    const styleHeader = {
      font: { bold: true, sz: 11, color: { rgb: "FFFFFF" } },
      fill: { patternType: "solid", fgColor: { rgb: "2C5282" } },
      alignment: { horizontal: "center", vertical: "center" },
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } }
      }
    };

    const styleResumoTitulo = {
      font: { bold: true, sz: 12, color: { rgb: "FFFFFF" } },
      fill: { patternType: "solid", fgColor: { rgb: "2D7A3E" } },
      alignment: { horizontal: "center", vertical: "center" },
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } }
      }
    };

    const styleResumoLabel = {
      font: { bold: true, sz: 10 },
      fill: { patternType: "solid", fgColor: { rgb: "D5E8D4" } },
      alignment: { horizontal: "left", vertical: "center" },
      border: {
        top: { style: "thin", color: { rgb: "CCCCCC" } },
        bottom: { style: "thin", color: { rgb: "CCCCCC" } },
        left: { style: "thin", color: { rgb: "CCCCCC" } },
        right: { style: "thin", color: { rgb: "CCCCCC" } }
      }
    };

    const styleResumoValor = {
      font: { sz: 10, bold: true },
      fill: { patternType: "solid", fgColor: { rgb: "E8F5E9" } },
      alignment: { horizontal: "right", vertical: "center" },
      border: {
        top: { style: "thin", color: { rgb: "CCCCCC" } },
        bottom: { style: "thin", color: { rgb: "CCCCCC" } },
        left: { style: "thin", color: { rgb: "CCCCCC" } },
        right: { style: "thin", color: { rgb: "CCCCCC" } }
      }
    };

    const styleDataPar = {
      fill: { patternType: "solid", fgColor: { rgb: "E3F2FD" } },
      alignment: { horizontal: "center", vertical: "center" },
      border: {
        top: { style: "thin", color: { rgb: "DDDDDD" } },
        bottom: { style: "thin", color: { rgb: "DDDDDD" } },
        left: { style: "thin", color: { rgb: "DDDDDD" } },
        right: { style: "thin", color: { rgb: "DDDDDD" } }
      }
    };

    const styleDataImpar = {
      fill: { patternType: "solid", fgColor: { rgb: "FFFFFF" } },
      alignment: { horizontal: "center", vertical: "center" },
      border: {
        top: { style: "thin", color: { rgb: "DDDDDD" } },
        bottom: { style: "thin", color: { rgb: "DDDDDD" } },
        left: { style: "thin", color: { rgb: "DDDDDD" } },
        right: { style: "thin", color: { rgb: "DDDDDD" } }
      }
    };

    let ws;
    
    if (tipoKm === 'variado') {
      // Formato com lista de corridas
      const wsData = [
        [{ v: 'Simulação de Corridas - ' + nomeContrato, t: 's' }],
        [],
        [{ v: 'Corrida', t: 's' }, { v: 'KM', t: 's' }, { v: 'Valor (R$)', t: 's' }],
        ...dados.corridas.map(corrida => [
          { v: corrida.numero, t: 'n' },
          { v: corrida.km.toFixed(2).replace('.', ','), t: 's' },
          { v: 'R$ ' + corrida.valor.toFixed(2).replace('.', ','), t: 's' }
        ]),
        [],
        [{ v: 'RESUMO', t: 's' }],
        [{ v: 'Média de KM:', t: 's' }, { v: dados.mediaKm.toFixed(2).replace('.', ','), t: 's' }],
        [{ v: 'Total de Corridas:', t: 's' }, { v: dados.totalCorridas, t: 'n' }],
        [{ v: 'Total em R$:', t: 's' }, { v: 'R$ ' + dados.totalEmReais.toFixed(2).replace('.', ','), t: 's' }]
      ];

      ws = XLSX.utils.aoa_to_sheet(wsData);

      // Mesclar células do título
      ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }];

      // Aplicar estilos - Título
      ws['A1'].s = styleTitulo;

      // Aplicar estilos - Cabeçalho da tabela
      ['A3', 'B3', 'C3'].forEach(cell => {
        if (ws[cell]) ws[cell].s = styleHeader;
      });

      // Aplicar estilos - Dados (linhas alternadas)
      dados.corridas.forEach((_, idx) => {
        const row = idx + 4;
        const style = idx % 2 === 0 ? styleDataPar : styleDataImpar;
        ['A', 'B', 'C'].forEach(col => {
          const cell = col + row;
          if (ws[cell]) ws[cell].s = style;
        });
      });

      // Aplicar estilos - Resumo
      const resumoStartRow = dados.corridas.length + 6;
      
      // Título do resumo com merge
      ws['A' + resumoStartRow].s = styleResumoTitulo;
      if (ws['!merges']) {
        ws['!merges'].push({ s: { r: resumoStartRow - 1, c: 0 }, e: { r: resumoStartRow - 1, c: 2 } });
      }

      // Linhas do resumo
      [resumoStartRow + 1, resumoStartRow + 2, resumoStartRow + 3].forEach(row => {
        if (ws['A' + row]) ws['A' + row].s = styleResumoLabel;
        if (ws['B' + row]) ws['B' + row].s = styleResumoValor;
      });

    } else {
      // Formato resumido para KM fixo
      const wsData = [
        [{ v: 'Simulação de Corridas - ' + nomeContrato, t: 's' }],
        [{ v: 'Tipo: KM Fixo', t: 's' }],
        [],
        [{ v: 'RESUMO DA SIMULAÇÃO', t: 's' }],
        [{ v: 'Quantidade de Corridas:', t: 's' }, { v: dados.totalCorridas, t: 'n' }],
        [{ v: 'KM por Corrida:', t: 's' }, { v: dados.kmFixo.toFixed(2).replace('.', ',') + ' km', t: 's' }],
        [{ v: 'KM Total:', t: 's' }, { v: dados.kmTotal.toFixed(2).replace('.', ',') + ' km', t: 's' }],
        [{ v: 'Valor por Corrida:', t: 's' }, { v: 'R$ ' + dados.valorPorCorrida.toFixed(2).replace('.', ','), t: 's' }],
        [{ v: 'Valor Total:', t: 's' }, { v: 'R$ ' + dados.totalEmReais.toFixed(2).replace('.', ','), t: 's' }]
      ];

      ws = XLSX.utils.aoa_to_sheet(wsData);

      // Mesclar células
      ws['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }, // Título
        { s: { r: 3, c: 0 }, e: { r: 3, c: 1 } }  // Subtítulo RESUMO
      ];

      // Aplicar estilos - Título
      ws['A1'].s = styleTitulo;

      // Aplicar estilos - Subtítulo
      ws['A2'].s = {
        font: { bold: true, sz: 10, color: { rgb: "1E3A5F" } },
        fill: { patternType: "solid", fgColor: { rgb: "E3F2FD" } },
        alignment: { horizontal: "center", vertical: "center" },
        border: {
          top: { style: "thin", color: { rgb: "CCCCCC" } },
          bottom: { style: "thin", color: { rgb: "CCCCCC" } },
          left: { style: "thin", color: { rgb: "CCCCCC" } },
          right: { style: "thin", color: { rgb: "CCCCCC" } }
        }
      };

      // Aplicar estilos - Título do resumo
      ws['A4'].s = styleResumoTitulo;

      // Aplicar estilos - Linhas do resumo
      [5, 6, 7, 8, 9].forEach(row => {
        if (ws['A' + row]) ws['A' + row].s = styleResumoLabel;
        if (ws['B' + row]) ws['B' + row].s = styleResumoValor;
      });
    }
    
    // Largura das colunas
    ws['!cols'] = [
      { wch: 28 },
      { wch: 20 },
      { wch: 20 }
    ];

    // Altura das linhas
    ws['!rows'] = [{ hpt: 30 }]; // Título com altura maior

    XLSX.utils.book_append_sheet(wb, ws, 'Simulação');
    
    const fileName = `Simulacao_${nomeContrato.replace(/\s+/g, '_')}_${new Date().getTime()}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const onSubmit = (data) => {
    setIsGenerating(true);
    
    try {
      const bandeira = parseFloat(data.bandeira.replace(',', '.'));
      const bandeirada = parseFloat(data.bandeirada.replace(',', '.'));
      const desconto = parseFloat(data.desconto.replace(',', '.'));
      const quantidadeCorridas = parseInt(data.quantidadeCorridas);

      let dadosExportacao;

      if (data.tipoKm === 'variado') {
        const kmMinimo = parseFloat(data.kmMinimo.replace(',', '.'));
        const kmMaximo = parseFloat(data.kmMaximo.replace(',', '.'));

        // Validação adicional
        if (kmMinimo >= kmMaximo) {
          toast.error('KM mínimo deve ser menor que KM máximo!');
          setIsGenerating(false);
          return;
        }

        // Gerar corridas
        const corridas = gerarCorridas(kmMinimo, kmMaximo, quantidadeCorridas);
        
        // Calcular valores
        const corridasComValor = corridas.map(corrida => ({
          ...corrida,
          valor: calcularValorCorrida(corrida.km, bandeira, bandeirada, desconto)
        }));

        // Calcular estatísticas
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
        // KM Fixo
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

      // Exportar para Excel
      exportarParaExcel(dadosExportacao, data.nomeContrato, data.tipoKm);
      
      toast.success('Excel gerado com sucesso!', {
        icon: '📊'
      });

      // Limpar formulário após sucesso
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

  return (
    <Container>
      <Header>
        <button className="back-button" onClick={() => navigate('/')}>
          <i className="fa-solid fa-arrow-left"></i>
          Voltar
        </button>
      </Header>
      
      <PageHeader 
        title="Simulador de Corridas" 
        breadcrumbs={[
          { label: 'Início', path: '/' },
          { label: 'Simulador' }
        ]}
      />

      <FormContainer>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <InputGroup>
            <label htmlFor="nomeContrato">
              <i className="fa-solid fa-file-signature" style={{marginRight: '8px'}}></i>
              Nome do Contrato *
            </label>
            {errors.nomeContrato && <p className='error'>{errors.nomeContrato.message}</p>}
            <input 
              {...register('nomeContrato')}
              type="text" 
              placeholder='Ex: Simulação Petrobras' 
              id="nomeContrato" 
            />
          </InputGroup>

          <Divider />

          <SectionTitle>
            <div className="icon">
              <i className="fa-solid fa-cog"></i>
            </div>
            <h2>Parâmetros do Cálculo</h2>
          </SectionTitle>

          <InputRow>
            <InputGroup>
              <label htmlFor="bandeira">Bandeira (R$ por km) *</label>
              {errors.bandeira && <p className='error'>{errors.bandeira.message}</p>}
              <input 
                {...register('bandeira')}
                type="text"
                placeholder='3,54'
                maxLength={5}
                id="bandeira"
                onInput={handleMoneyMask}
              />
            </InputGroup>

            <InputGroup>
              <label htmlFor="bandeirada">Bandeirada (R$ fixo) *</label>
              {errors.bandeirada && <p className='error'>{errors.bandeirada.message}</p>}
              <input 
                {...register('bandeirada')}
                type="text"
                placeholder='5,50'
                maxLength={5}
                id="bandeirada"
                onInput={handleMoneyMask}
              />
            </InputGroup>
          </InputRow>

          <InputGroup>
            <label htmlFor="desconto">
              <i className="fa-solid fa-percent" style={{marginRight: '8px'}}></i>
              Desconto (%) *
            </label>
            {errors.desconto && <p className='error'>{errors.desconto.message}</p>}
            <input 
              {...register('desconto')}
              type="text"
              placeholder='10,50'
              maxLength={5}
              id="desconto"
              onInput={handleMoneyMask}
            />
          </InputGroup>

          <Divider />

          <SectionTitle>
            <div className="icon">
              <i className="fa-solid fa-route"></i>
            </div>
            <h2>Parâmetros de Distância</h2>
          </SectionTitle>

          <InputGroup>
            <label>
              <i className="fa-solid fa-sliders" style={{marginRight: '8px'}}></i>
              Tipo de KM *
            </label>
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
          </InputGroup>

          {tipoKm === 'variado' ? (
            <InputRow>
              <InputGroup>
                <label htmlFor="kmMinimo">KM Mínimo por Corrida *</label>
                {errors.kmMinimo && <p className='error'>{errors.kmMinimo.message}</p>}
                <input 
                  {...register('kmMinimo')}
                  type="text"
                  placeholder='5'
                  id="kmMinimo"
                  onInput={handleDecimalMask}
                />
              </InputGroup>

              <InputGroup>
                <label htmlFor="kmMaximo">KM Máximo por Corrida *</label>
                {errors.kmMaximo && <p className='error'>{errors.kmMaximo.message}</p>}
                <input 
                  {...register('kmMaximo')}
                  type="text"
                  placeholder='50'
                  id="kmMaximo"
                  onInput={handleDecimalMask}
                />
              </InputGroup>
            </InputRow>
          ) : (
            <InputGroup>
              <label htmlFor="kmFixo">KM por Corrida (Fixo) *</label>
              {errors.kmFixo && <p className='error'>{errors.kmFixo.message}</p>}
              <input 
                {...register('kmFixo')}
                type="text"
                placeholder='25'
                id="kmFixo"
                onInput={handleDecimalMask}
              />
            </InputGroup>
          )}

          <Divider />

          <SectionTitle>
            <div className="icon">
              <i className="fa-solid fa-taxi"></i>
            </div>
            <h2>Quantidade de Corridas</h2>
          </SectionTitle>

          <InputGroup>
            <label htmlFor="quantidadeCorridas">Quantidade de Corridas a Simular *</label>
            {errors.quantidadeCorridas && <p className='error'>{errors.quantidadeCorridas.message}</p>}
            <input 
              {...register('quantidadeCorridas')}
              type="text"
              placeholder='100'
              id="quantidadeCorridas"
              onInput={handleIntegerMask}
            />
          </InputGroup>

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
        </Form>
      </FormContainer>
    </Container>
  )
}

export default Simulador;