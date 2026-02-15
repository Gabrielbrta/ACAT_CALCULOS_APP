import React, { useEffect } from 'react';
import styled from 'styled-components';
import z from 'zod';
import Btn from './Button';
import { Title, Subtitle } from './Title';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useContract } from '../contexts/ContractContext';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import PageHeader from './PageHeader';


// estilos --------------------------
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

const FormContract = styled.form`
    display: flex;
    flex-direction: column;
    gap: 0px;
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
    
    .section-divider {
        border: none;
        border-top: 1px solid ${({theme}) => theme.color.divider};
    }
`;

const CalculoCard = styled.div`
    border: 1px solid ${({theme}) => theme.color.border};
    padding: 18px;
    border-radius: ${({theme}) => theme.borderRadius.medium};
    margin-bottom: 14px;
    background: ${({theme}) => theme.color.bgHover};
    position: relative;
    transition: all 0.3s ease;
    
    &:hover {
        border-color: ${({theme}) => theme.color.borderDark};
        box-shadow: ${({theme}) => theme.shadow.small};
    }
    
    .remove-button {
        position: absolute;
        top: 12px;
        right: 12px;
        background: ${({theme}) => theme.color.danger};
        color: ${({theme}) => theme.color.textOnDark};
        border: none;
        border-radius: 50%;
        width: 28px;
        height: 28px;
        cursor: pointer;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        box-shadow: ${({theme}) => theme.shadow.small};
        
        &:hover {
            background: ${({theme}) => theme.color.dangerHover};
            transform: rotate(90deg) scale(1.1);
        }
    }
    
    .card-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 14px;
        padding-bottom: 12px;
        border-bottom: 1px solid ${({theme}) => theme.color.border};
        
        h3 {
            font-size: 1rem;
            color: ${({theme}) => theme.color.title};
            font-weight: ${({theme}) => theme.font.wheightBold};
            margin: 0;
        }
        
        .card-icon {
            background: ${({theme}) => theme.color.primary};
            color: ${({theme}) => theme.color.textOnDark};
            width: 28px;
            height: 28px;
            border-radius: ${({theme}) => theme.borderRadius.small};
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.9rem;
        }
    }
    
    .input-group {
        margin-bottom: 12px;
        
        &:last-child {
            margin-bottom: 0;
        }
    }
`;

const AddButton = styled.button`
    width: 100%;
    padding: 8px;
    background: ${({theme}) => theme.color.success};
    color: ${({theme}) => theme.color.textOnDark};
    border: none;
    border-radius: ${({theme}) => theme.borderRadius.medium};
    cursor: pointer;
    font-size: 0.95rem;
    font-weight: ${({theme}) => theme.font.wheightBold};
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.3s ease;
    box-shadow: ${({theme}) => theme.shadow.small};
    
    &:hover {
        background: ${({theme}) => theme.color.successHover};
        transform: translateY(-1px);
        box-shadow: ${({theme}) => theme.shadow.medium};
    }
    
    &:active {
        transform: translateY(0);
    }
    
    i {
        font-size: 1rem;
    }
`;

const SubmitButton = styled(Btn)`
    margin-top: 8px;
    padding: 12px;
    font-size: 1rem;
    width: 100%;
    background: ${({theme}) => theme.color.button};
    
    &:hover {
        transform: translateY(-1px);
        box-shadow: ${({theme}) => theme.shadow.medium};
    }
`;

const SectionTitle = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 24px 0 16px 0;
    
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

// estilos --------------------------

//Schema Formulario ------------------------
const calculoSchema = z.object({
    nomeCalculo: z.string().min(2, 'Nome obrigatório').max(30, 'Máximo 30 caracteres'),
    bandeira: z.string()
        .min(1, 'Campo obrigatório')
        .max(5, 'Máximo 5 caracteres')
        .regex(/^\d{1,2}(,\d{1,2})?$/, "Use formato 0,00 (exemplo: 3,54)"),
    bandeirada: z.string()
        .min(1, 'Campo obrigatório')
        .max(5, 'Máximo 5 caracteres')
        .regex(/^\d{1,2}(,\d{1,2})?$/, "Use formato 0,00 (exemplo: 5,50)"),
    desconto: z.string().optional(),
});

const schema = z.object({
    nomeContrato: z.string().min(2, 'Campo Obrigatório').max(30, 'Máximo 30 caracteres'),
    calculos: z.array(calculoSchema).min(1, 'Adicione pelo menos um cálculo'),
}).transform((fields) => ({
    nomeContrato: fields.nomeContrato,
    calculos: fields.calculos.map(calc => ({
        nomeCalculo: calc.nomeCalculo,
        bandeira: Number(calc.bandeira.replace(",", ".")),
        bandeirada: Number(calc.bandeirada.replace(",", ".")),
        desconto: calc.desconto ? Number(calc.desconto.replace(",", ".").replace("%", "")) : false,
    }))
}));
//Schema Formulario ------------------------

// formulario -----------------------------------
const Form = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const { saveContrato, updateContrato, getContratoById } = useContract();
    const isEditMode = !!id;
    const contratoToEdit = location.state?.contrato || (id ? getContratoById(id) : null);

    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
        control
    } = useForm({
        mode:'all',
        criteriaMode: 'all',
        resolver: zodResolver(schema),
        defaultValues: {
            nomeContrato: '',
            calculos: [],
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'calculos'
    });

    // Carrega dados para edição
    useEffect(() => {
        if (isEditMode && contratoToEdit) {
            // Retrocompatibilidade: se não tiver calculos[], criar baseado nos dados antigos
            const calculos = contratoToEdit.calculos || [
                {
                    nomeCalculo: 'Bandeira 1',
                    bandeira: contratoToEdit.bandeira1,
                    bandeirada: contratoToEdit.bandeirada1,
                    desconto: contratoToEdit.desconto1
                },
                ...(contratoToEdit.hasBandeira2 ? [{
                    nomeCalculo: 'Bandeira 2',
                    bandeira: contratoToEdit.bandeira2,
                    bandeirada: contratoToEdit.bandeirada2,
                    desconto: contratoToEdit.desconto2
                }] : [])
            ];
            
            reset({
                nomeContrato: contratoToEdit.nomeContrato,
                calculos: calculos.map(calc => ({
                    nomeCalculo: calc.nomeCalculo,
                    bandeira: calc.bandeira.toFixed(2).replace('.', ','),
                    bandeirada: calc.bandeirada.toFixed(2).replace('.', ','),
                    desconto: calc.desconto ? calc.desconto.toString() : ''
                }))
            });
        } else if (isEditMode && !contratoToEdit) {
            console.error('Modo edição ativado mas contrato não encontrado. ID:', id);
        }
    }, [isEditMode, contratoToEdit, reset]);

    const adicionarCalculo = () => {
        append({
            nomeCalculo: '',
            bandeira: '',
            bandeirada: '',
            desconto: ''
        });
    };

    const handleSubmitForm = async (data) => {
        if (isEditMode) {
            await updateContrato(Number(id), data);
        } else {
            await saveContrato(data);
        }
        reset();
        navigate('/contratos');
    };

    // Máscara para valores monetários - permite digitar livremente
    const handleMoneyMask = (e) => {
        let value = e.target.value;
        // Remove tudo que não é número ou vírgula
        value = value.replace(/[^\d,]/g, '');
        // Garante apenas uma vírgula
        const parts = value.split(',');
        if (parts.length > 2) {
            value = parts[0] + ',' + parts.slice(1).join('');
        }
        e.target.value = value;
    };

    // Máscara para desconto - apenas números, max 100
    const handlePercentMask = (e) => {
        let value = e.target.value.replace(/\D/g, ''); // Remove não-dígitos
        if (value && parseInt(value) > 100) {
            value = '100';
        }
        e.target.value = value;
    };


  return (
    <Container>
      <Header>
        <button className="back-button" onClick={() => navigate('/contratos')}>
          <i className="fa-solid fa-arrow-left"></i>
          Voltar
        </button>
      </Header>
      
      <PageHeader 
        title={isEditMode ? "Editar Contrato" : "Adicionar Contrato"} 
        breadcrumbs={[
          { label: 'Início', path: '/' },
          { label: 'Contratos', path: '/contratos' },
          { label: isEditMode ? 'Editar Contrato' : 'Novo Contrato' }
        ]}
      />

      <FormContainer>
        <FormContract className='home-form' onSubmit={handleSubmit(handleSubmitForm)}>
            <div className="input-group">
                <label htmlFor="nomeContrato">
                    <i className="fa-solid fa-file-signature" style={{marginRight: '8px'}}></i>
                    Nome do Contrato *
                </label>
                {errors.nomeContrato && <p className='error'>{errors.nomeContrato.message}</p>}
                <input 
                    {...register('nomeContrato')}
                    type="text" 
                    placeholder='Ex: Petrobras, Vale' 
                    name="nomeContrato" 
                    id="nomeContrato" 
                />
            </div>
            
            <hr className="section-divider" />
            
            <SectionTitle>
                <h2>Cálculos</h2>
            </SectionTitle>
            
            {errors.calculos && <p className='error'>{errors.calculos.message}</p>}
            
            {fields.map((field, index) => (
                <CalculoCard key={field.id}>
                    <button
                        type="button"
                        onClick={() => remove(index)}
                        className="remove-button"
                        title="Remover cálculo"
                    >
                        ×
                    </button>
                    
                    <div className="card-header">
                        <div className="card-icon">
                            <i className="fa-solid fa-hashtag"></i>
                        </div>
                        <h3>Cálculo {index + 1}</h3>
                    </div>
                    
                    <div className="input-group">
                        <label>Nome do Cálculo *</label>
                        {errors.calculos?.[index]?.nomeCalculo && (
                            <p className='error'>{errors.calculos[index].nomeCalculo.message}</p>
                        )}
                        <input 
                            {...register(`calculos.${index}.nomeCalculo`)}
                            type="text"
                            placeholder='Ex: Bandeira 1, Noturno, Domingo...'
                        />
                    </div>
                    
                    <div className="input-group">
                        <label>Bandeira (R$ por km) *</label>
                        {errors.calculos?.[index]?.bandeira && (
                            <p className='error'>{errors.calculos[index].bandeira.message}</p>
                        )}
                        <input 
                            {...register(`calculos.${index}.bandeira`)}
                            type="text"
                            placeholder='3,54'
                            maxLength={5}
                            onInput={handleMoneyMask}
                        />
                    </div>
                    
                    <div className="input-group">
                        <label>Bandeirada (R$ fixo) *</label>
                        {errors.calculos?.[index]?.bandeirada && (
                            <p className='error'>{errors.calculos[index].bandeirada.message}</p>
                        )}
                        <input 
                            {...register(`calculos.${index}.bandeirada`)}
                            type="text"
                            placeholder='5,50'
                            maxLength={5}
                            onInput={handleMoneyMask}
                        />
                    </div>
                    
                    <div className="input-group">
                        <label>Desconto (%)</label>
                        {errors.calculos?.[index]?.desconto && (
                            <p className='error'>{errors.calculos[index].desconto.message}</p>
                        )}
                        <input 
                            {...register(`calculos.${index}.desconto`)}
                            type="text"
                            placeholder='10'
                            maxLength={3}
                            onInput={handlePercentMask}
                        />
                    </div>
                </CalculoCard>
            ))}
            
            <AddButton
                type="button"
                onClick={adicionarCalculo}
            >
                Adicionar Novo Cálculo
            </AddButton>
            
            <SubmitButton type="submit">
                {isEditMode ? 'Salvar Alterações' : 'Criar Contrato'}
            </SubmitButton>
        </FormContract>
      </FormContainer>
    </Container>
  )
}

export default Form;