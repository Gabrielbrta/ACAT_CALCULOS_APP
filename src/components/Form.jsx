import {useState} from 'react';
import styled from 'styled-components';
import { Subtitle } from './Title';
import Btn from './Button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';

const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    overflow-y: auto;
    height: 100%;
    background-color: ${({theme}) => theme.color.bgColorElements};
    padding: 20px 15px;
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

const schema = z.object({
    nomeContrato: z.string().min(2, 'Campo Obrigatório'). max(30, 'Campo Obrigatório'),

    bandeira1: z.string().max(4, "Campo Obrigatório").min(1, "Campo Obrigatório"),

    bandeirada1: z.string().max(4, "Campo Obrigatório").min(1, "Campo Obrigatório"),

    hasBandeira2: z.boolean(),

    bandeira2: z.string(),

    bandeirada2: z.string(),
}).superRefine((values, ctx) => {
    let b2Vazio = values.hasBandeira2 && values.bandeira2.length < 3; 
    if(b2Vazio) {
        ctx.addIssue({
            path: ['bandeira2'],
            code: 'too_small',
            inclusive: true,
            minimum: 3,
            message: "Campo obrigatório"
        });
    }
    let bda2Vazio = values.bandeirada2.length < 3 && values.hasBandeira2
    if(bda2Vazio) {
        ctx.addIssue({
            path: ['bandeirada2'],
            code: 'too_small',
            minimum: 3,
            inclusive: true,
            message: "Campo obrigatório"
        })
    }
})


const Form = () => {
    const {
        register,
        handleSubmit,
        formState: {errors},
        watch
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
    const handleSubmitForm = (data) => {
        console.log(data);
        
    }
    console.log(errors)

  return (
    <FormContainer>
        <Subtitle>CADASTRO DE CONTRATO</Subtitle>
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