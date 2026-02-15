import React from 'react';
import styled from 'styled-components';
import z from 'zod';
import Btn from './Button';
import { Subtitle } from './Title';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useContract } from '../contexts/ContractContext';


// estilos --------------------------
const FormContainer = styled.div`

@keyframes hideMenu {
    0% {
        visibility: hidden;
        width: 100%;
    } 100% {
        visibility: visible;
        width: 80px;
    }
}
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    height: 100%;
    background-color: ${({theme}) => theme.color.bgColorElements};
    padding: 20px 15px;
    border-radius: 15px 0px 0px 15px;
    position: relative;
    
    &.closed {
        animation:forwards hideMenu .5s;
        justify-self: self-end;
        form {
            opacity: 0;
        }
        h2 {
            opacity: 0;

        }

    }

    .toggle-button {
        position: absolute;
        left: 20px;
        z-index: 10;
        cursor: pointer;
        font-size: 1.2rem;
        display:inline-block;
        padding: 3px 5px;
        background: linear-gradient(90deg, ${({theme}) => theme.color.bgColorElements}, 80%, #e7e7e7);
        border-radius: 5px;
        transition: transform .6s;
        transition: .5s;
        opacity: 1;
        &:hover {
            background: #cacaca;

        }
    }
`
const FormContract = styled.form`
    display: flex;
    flex-direction: column;
    gap: 3px;
    width: 100%;
    height: 100%;
    margin-top: 20px;
    transition: .3s;
    input{
        width: 100%;
        padding: ${({theme}) => theme.spacing.inputPadding};
        border-radius: 5px;
        border: 1px solid #acacac;
        font-size: ${({theme}) => theme.text.textSize};
    }
    h2:last-of-type{
        margin-top: 15px;
    }

    .error {
        color: #d42d2d;
        font-size: .875rem;
    }
`;

// estilos --------------------------

//Schema Formulario ------------------------
const calculoSchema = z.object({
    nomeCalculo: z.string().min(2, 'Nome obrigatório').max(30, 'Máximo 30 caracteres'),
    bandeira: z.string()
        .max(5, 'Somente 5 caracteres')
        .min(1, 'Mínimo de 4 caracteres')
        .regex(/^\d{1,2},\d{2}$/, "formato 0,00 ou 00,00"),
    bandeirada: z.string()
        .max(5, 'Somente 5 caracteres')
        .min(1, 'Mínimo de 4 caracteres')
        .regex(/^\d{1,2},\d{2}$/, "formato 0,00 ou 00,00"),
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
    const [menu, setMenu] = React.useState(false);
    const { saveContrato } = useContract();

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

    const adicionarCalculo = () => {
        append({
            nomeCalculo: '',
            bandeira: '',
            bandeirada: '',
            desconto: ''
        });
    };

    const handleSubmitForm = async (data) => {
        await saveContrato(data);
        reset();
    };


  return (
    <FormContainer className={!menu ? "closed" : ""}>
        <a onClick={() => setMenu((value) => !value)}
         className='toggle-button'>{!menu ? <i className="fa-solid fa-file-circle-plus"></i>:<i className="fa-solid fa-arrow-right-from-bracket"></i>}</a>
        <Subtitle>Criar Contrato</Subtitle>
        <FormContract className='home-form' onSubmit={handleSubmit(handleSubmitForm)}>
            <label htmlFor="nomeContrato">Nome Contrato</label>
            {errors.nomeContrato && <p className='error'>{errors.nomeContrato.message}</p>}
            <input 
                {...register('nomeContrato')}
                type="text" 
                placeholder='Petrobras' 
                name="nomeContrato" 
                id="nomeContrato" 
            />
            <br />
            
            <Subtitle>Cálculos</Subtitle>
            {errors.calculos && <p className='error'>{errors.calculos.message}</p>}
            
            {fields.map((field, index) => (
                <div key={field.id} style={{
                    border: '1px solid #ddd',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '15px',
                    backgroundColor: '#f9f9f9',
                    position: 'relative'
                }}>
                    <button
                        type="button"
                        onClick={() => remove(index)}
                        style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '25px',
                            height: '25px',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        ×
                    </button>
                    
                    <h3 style={{ marginBottom: '10px', fontSize: '1rem' }}>
                        Cálculo {index + 1}
                    </h3>
                    
                    <label>Nome do Cálculo *</label>
                    {errors.calculos?.[index]?.nomeCalculo && (
                        <p className='error'>{errors.calculos[index].nomeCalculo.message}</p>
                    )}
                    <input 
                        {...register(`calculos.${index}.nomeCalculo`)}
                        type="text"
                        placeholder='Ex: Bandeira 1, Noturno, Domingo...'
                    />
                    
                    <label>Bandeira (R$ por km) *</label>
                    {errors.calculos?.[index]?.bandeira && (
                        <p className='error'>{errors.calculos[index].bandeira.message}</p>
                    )}
                    <input 
                        {...register(`calculos.${index}.bandeira`)}
                        type="text"
                        placeholder='3,54'
                        maxLength={5}
                    />
                    
                    <label>Bandeirada (R$ fixo) *</label>
                    {errors.calculos?.[index]?.bandeirada && (
                        <p className='error'>{errors.calculos[index].bandeirada.message}</p>
                    )}
                    <input 
                        {...register(`calculos.${index}.bandeirada`)}
                        type="text"
                        placeholder='5,50'
                        maxLength={5}
                    />
                    
                    <label>Desconto (%)</label>
                    {errors.calculos?.[index]?.desconto && (
                        <p className='error'>{errors.calculos[index].desconto.message}</p>
                    )}
                    <input 
                        {...register(`calculos.${index}.desconto`)}
                        type="text"
                        placeholder='10'
                        maxLength={3}
                    />
                </div>
            ))}
            
            <button
                type="button"
                onClick={adicionarCalculo}
                style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    marginBottom: '15px'
                }}
            >
                + Adicionar Cálculo
            </button>
            
            <Btn type="submit">Criar Contrato</Btn>
        </FormContract>
    </FormContainer>
  )
}

export default Form;