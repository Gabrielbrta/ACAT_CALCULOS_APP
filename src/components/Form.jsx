import React from 'react';
import styled from 'styled-components';
import z from 'zod';
import Btn from './Button';
import { Subtitle } from './Title';
import { useForm } from 'react-hook-form';
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
const schema = z.object({
    nomeContrato: z.string().min(2, 'Campo Obrigatório'). max(30, 'Campo Obrigatório'),
    
    bandeira1: z.string().max(5,('Somente 5 caracteres')).min(1,('Minimo de 4 caracteres')).regex(/^\d{1,2},\d{2}$/, "formato 0,00 ou 00,00"),
    
    bandeirada1: z.string().max(4,('Somente 5 caracteres')).min(1,('Minimo de 4 caracteres')).regex(/^\d{1,2},\d{2}$/, "formato 0,00 ou 00,00"),
    desconto1: z.string().optional(),
    
    hasBandeira2: z.boolean(),
    bandeira2: z.string(),
    bandeirada2: z.string(),
    desconto2: z.string().optional(),
}).superRefine((values, ctx) => {
    let regex = /^\d{1,2},\d{2}$/;

    if(!regex.test(values.bandeira2) && values.hasBandeira2) {
        ctx.addIssue({
            path: ['bandeira2'],
            code: 'invalid_element',
            inclusive: true,
            minimum: 5,
            message: "formato 0,00 ou 00,00"
        });
    }
    if(!regex.test(values.bandeirada2) && values.hasBandeira2) {
        ctx.addIssue({
            path: ['bandeirada2'],
            code: 'invalid_element',
            minimum: 5,
            inclusive: true,
            message: "formato 0,00 ou 00,00"
        })
    }
}).transform((fields) => ({
    hasBandeira2: fields.hasBandeira2,
    bandeirada2: fields.hasBandeira2 && fields.bandeira2 ? Number(fields.bandeirada2.replace(",", ".")): false,
    bandeira2: fields.hasBandeira2 && fields.bandeira2 ?Number(fields.bandeira2.replace(",", ".")): false,
    nomeContrato: fields.nomeContrato,
    bandeira1: Number(fields.bandeira1.replace(",", ".")),
    bandeirada1: Number(fields.bandeirada1.replace(",", ".")),
    desconto1: fields.desconto1 ? Number(fields.desconto1.replace(",", ".").replace("%", "")): false,
    desconto2: fields.desconto2 ? Number(fields.desconto2.replace(",", ".").replace("%", "")): false

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
        watch,
        reset
    } = useForm({
        mode:'all',
        criteriaMode: 'all',
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

    const hasBandeira2 = watch('hasBandeira2')
    const handleSubmitForm = async (data) => {
        await saveContrato(data);
        reset();
    }


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
            <Subtitle>Bandeira 1</Subtitle>
            <label htmlFor="bandeira1">Bandeira *</label>
            {errors.bandeira1 && <p className='error'>{errors.bandeira1.message}</p>}
            <input 
                {...register('bandeira1')}
                maxLength={4}
                type="text" 
                placeholder='3,54'
                name="bandeira1" 
                id="bandeira1" 
                />
                
            <label htmlFor="bandeirada1">Bandeirada *</label>
            {errors.bandeirada1 && <p className='error'>{errors.bandeirada1.message}</p>}
            <input 
                {...register('bandeirada1')}
                maxLength={5}
                type="text"
                name="bandeirada1" 
                id="bandeirada1"
                placeholder='3,54'
                />
            <label htmlFor="desconto1">Desconto</label>
            <input 
                {...register('desconto1')}
                type="text" 
                maxLength={3}
                name="desconto1" 
                placeholder='4'
                id="desconto1" 
                />
            <div style={{display: 'flex', alignItems:'center'}}>

                <label  htmlFor="hasBandeira2">
                    Tem Bandeira 2
                </label>
                    <input 
                        {...register('hasBandeira2')}
                        type="checkbox" 
                        name="hasBandeira2" 
                        id="hasBandeira2" 
                        style={{height: '15px', width: '20px'}}
                    />
            </div>
            {hasBandeira2 && (
            <> 
                <Subtitle>Bandeira 2</Subtitle>
                <label htmlFor="bandeira2">Bandeira 2 *</label>
                {errors.bandeira2 && <p className='error'>{errors.bandeira2.message}</p>}
                <input 
                {...register('bandeira2')}
                    type="text" 
                    name="bandeira2"
                    placeholder='4,32' 
                    id="bandeira2" 
                    />
                <label htmlFor="bandeirada2">Bandeirada 2 *</label>
                {errors.bandeirada2 && <p className='error'>{errors.bandeirada2.message}</p>}
                <input 
                {...register('bandeirada2')}
                    type='text'
                    name="bandeirada2" 
                    id="bandeirada2" 
                    placeholder='4,32' 
                    />
                <label htmlFor="desconto2">Desconto 2</label>
                <input 
                {...register('desconto2')}
                    type="text" 
                    name="desconto2" 
                    placeholder='5' 
                    id="desconto2" 
                    />
            </>
            )}
            
            <Btn type="submit" >Criar Contrato</Btn>
        </FormContract>
    </FormContainer>
  )
}

export default Form;