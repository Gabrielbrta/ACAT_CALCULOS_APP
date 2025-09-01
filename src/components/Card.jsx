import React from 'react'
import styled from 'styled-components';
import { useForm } from 'react-hook-form';

const CardsContainer = styled.div `
    display: flex;
    flex-direction: column;
    align-items: left;
    background-color: #f1f1f1;
    max-width: 376px;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.116);
    width: 100%;
    max-height: 210px;
    border-radius: 5px;
    height: 100%;
    padding: ${({theme}) => theme.spacing.cardPadding};
    .result {
        color: ${({theme}) => theme.color.result};
    }

`

const Input = styled.input`
    max-width: 55px;
    width: 100%;
    max-height: 30px;
    padding: ${({theme}) => theme.spacing.inputPadding};
    font-size: ${({theme}) => theme.text.textSize};
    border: 1px solid #acacac;
    border-radius: 4px;
`;

const Form = styled.form`
    display: flex;  
    flex: 1;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
    div {
        display: flex;
        width: 100%;
        flex: 1;
        align-items: center;
        justify-content: space-between;
    }

    .enviar {
        flex-direction: column;
        gap: 5px;
        align-items: start;

        button {
            width: 100%;
            padding: 7px;
            border-radius: 5px;
            border: none;
            background: #5a5ae7;
            color: white;
            transition: .3s;
            cursor: pointer;
            &:hover{
                background: #1f1fa7;
            }
        }
    }

    
`

const Card = ({contrato}) => {
    const {register, handleSubmit,watch, reset} = useForm();
    const [bandeira1Result, setBandeira1Result] = React.useState(0);
    const [bandeira2Result, setBandeira2Result] = React.useState(0);
    function toText(number) {return String(number.toFixed(2)).replace(".", ",");}
    function toNumber(text) {return Number(String(text).replace(",", "."));}

    React.useEffect(() => {
        reset()
        setBandeira1Result(false)
        setBandeira2Result(false)
    }, [contrato])
    
    let conteudo;
    function bandeira1() {
        let b1 = contrato.bandeira1;
        let bandeirada = contrato.bandeirada1;
        let km = toNumber(watch('b1'));
        let hp = toNumber(watch('hp1'));
        if(isNaN(km) || isNaN(hp)) {
            setBandeira1Result("Não foi possível calcular")
        } else {
            let resultado = (((km * b1) + bandeirada) + hp);
            let desconto = contrato.desconto1 ? (contrato.desconto1 / 100) * resultado : 0;
            resultado = km == "" ? resultado : resultado - desconto;
            resultado.toFixed(2);
            setBandeira1Result("R$ " + toText(resultado));
        }
        
    }
    function bandeira2() {
        let b2 = contrato.bandeira2;
        let bandeirada = contrato.bandeirada2;
        let km = toNumber(watch('b2'));
        let hp2 = toNumber(watch('hp2'));
        if(isNaN(km) || isNaN(hp2)) {
            setBandeira2Result("Não foi possível calcular")
        } else {
            let resultado = (((km * b2) + bandeirada) + hp2);
            let desconto = contrato.desconto2 ? (contrato.desconto2 / 100) * resultado : 0;
            resultado = km == "" ? resultado : resultado - desconto;
            resultado.toFixed(2);
            setBandeira2Result("R$ " + toText(resultado));
        }
    }

    if (contrato.bandeira1 && contrato.bandeira2 && contrato.bandeirada1 && contrato.bandeirada2) {
    conteudo = <>
        <CardsContainer>
            <p>Bandeira 1</p>
            <Form onSubmit={handleSubmit(bandeira1)}>
            <div className='inputs'>
                <label htmlFor="km">KM</label>
                <Input maxLength={6} {...register("b1")} type="text" id="km" />
                x <span>{toText(contrato.bandeira1)}</span> + <span>{toText(contrato.bandeirada1)}</span> +
                <label htmlFor="hp">HP</label>
                <Input maxLength={6} {...register("hp1")} type="text" id="hp" />
                {contrato.desconto1 && <span className='desconto'>- {contrato.desconto1}%</span>}
            </div>
            <div className='enviar'>
                <p>Resultado: <span className='result'>{bandeira1Result}</span></p>
                <button type='submit'>Enviar</button>
            </div>
            </Form>
        </CardsContainer>
        <CardsContainer>
            <p>Bandeira 2</p>
            <Form onSubmit={handleSubmit(bandeira2)}>
            <div className="inputs">
                <label htmlFor="km2">KM</label>
                <Input maxLength={6} {...register("b2")} type="text" id="km2" />
                x <span>{toText(contrato.bandeira2)}</span> + <span>{toText(contrato.bandeirada2)}</span> +
                <label htmlFor="hp2">HP</label>
                <Input maxLength={6} {...register("hp2")}type="text" id="hp2" />
                {contrato.desconto2 && <span className='desconto'>- {contrato.desconto2}%</span>}
            </div>
            <div className="enviar">
                <p>Resultado: <span className='result'>{bandeira2Result}</span></p>
                <button type='submit'>Enviar</button>
            </div>
            </Form>
        </CardsContainer>
        </>;
    }  else {
    conteudo = <>
        <CardsContainer>
            <p>Bandeira 1</p>
            <Form onSubmit={handleSubmit(bandeira1)}>
            <div className='inputs'>
                <label htmlFor="km">KM</label>
                <Input maxLength={6} {...register("b1")} type="text" id="km" />
                x <span>{toText(contrato.bandeira1)}</span> + <span>{toText(contrato.bandeirada1)}</span> +
                <label htmlFor="hp">HP</label>
                <Input maxLength={6} {...register("hp1")} type="text" id="hp" />
                {contrato.desconto1 && <span className='desconto'>- {contrato.desconto1}%</span>}
            </div>
            <div className='enviar'>
                <p>Resultado: <span className='result'>{bandeira1Result}</span></p>
                <button type='submit'>Enviar</button>
            </div>
            </Form>
        </CardsContainer>
    </>;
    }
  return (
    <>
    {conteudo}
    </>
  )
}

export default Card