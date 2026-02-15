import React from 'react'
import styled from 'styled-components';
import { useForm } from 'react-hook-form';

const CardsContainer = styled.div `
    display: flex;
    flex-direction: column;
    background-color: ${({theme}) => theme.color.bgCard};
    box-shadow: ${({theme}) => theme.shadow.medium};
    width: 100%;
    border-radius: ${({theme}) => theme.borderRadius.large};
    padding: 24px;
    border: 1px solid ${({theme}) => theme.color.border};
    transition: all 0.3s ease;
    min-height: 280px;
    
    &:hover {
        box-shadow: ${({theme}) => theme.shadow.large};
        transform: translateY(-2px);
    }
    
    .result {
        color: ${({theme}) => theme.color.primary};
        font-weight: ${({theme}) => theme.font.wheightBold};
    }
    
    h3 {
        margin: 0 0 16px 0;
        color: ${({theme}) => theme.color.title};
        font-size: 1.1rem;
        font-weight: ${({theme}) => theme.font.wheightBold};
        display: flex;
        align-items: center;
        gap: 8px;
        padding-bottom: 12px;
        border-bottom: 2px solid ${({theme}) => theme.color.divider};
    }
    
    p {
        color: ${({theme}) => theme.color.text};
        font-size: ${({theme}) => theme.text.textSize};
        margin: 0 0 10px 0;
    }
`

const Input = styled.input`
    max-width: 55px;
    width: 100%;
    max-height: 32px;
    padding: ${({theme}) => theme.spacing.inputPadding};
    font-size: ${({theme}) => theme.text.textSize};
    border: 1px solid ${({theme}) => theme.color.border};
    border-radius: ${({theme}) => theme.borderRadius.small};
    background-color: ${({theme}) => theme.color.bgColorElements};
    color: ${({theme}) => theme.color.text};
    transition: all 0.2s ease;
    
    &:focus {
        outline: none;
        border-color: ${({theme}) => theme.color.primary};
        box-shadow: 0 0 0 2px rgba(30, 58, 95, 0.1);
    }
`;

const Form = styled.form`
    display: flex;  
    flex: 1;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
    gap: 5px;
    
    div {
        display: flex;
        width: 100%;
        flex: 1;
        align-items: center;
        justify-content: space-between;
        color: ${({theme}) => theme.color.text};
        font-size: ${({theme}) => theme.text.textSize};
        margin-bottom: 5px;
        
        label {
            font-size: 0.85rem;
            font-weight: ${({theme}) => theme.font.wheightH3};
        }
        
        span {
            color: ${({theme}) => theme.color.primary};
            font-weight: ${({theme}) => theme.font.wheightH3};
            font-size: 0.9rem;
        }
        
        .desconto {
            color: ${({theme}) => theme.color.success};
        }
    }

    .enviar {
        flex-direction: column;
        gap: 8px;
        align-items: start;
        margin-top: 5px;

        button {
            width: 100%;
            padding: 10px;
            border-radius: ${({theme}) => theme.borderRadius.medium};
            border: none;
            background: ${({theme}) => theme.color.button};
            color: ${({theme}) => theme.color.buttonText};
            transition: all 0.2s ease;
            cursor: pointer;
            font-weight: ${({theme}) => theme.font.wheightH3};
            box-shadow: ${({theme}) => theme.shadow.small};
            font-size: ${({theme}) => theme.text.textSize};
            
            &:hover {
                background: ${({theme}) => theme.color.buttonHover};
                transform: translateY(-1px);
                box-shadow: ${({theme}) => theme.shadow.medium};
            }
            
            &:active {
                transform: translateY(0);
            }
        }
    }
`

const Card = ({calculo, calculoIndex}) => {
    const {register, handleSubmit, watch, reset} = useForm();
    const [resultado, setResultado] = React.useState(0);
    
    function toText(number) {return String(number.toFixed(2)).replace(".", ",");}
    function toNumber(text) {return Number(String(text).replace(",", "."));}

    React.useEffect(() => {
        reset();
        setResultado(0);
    }, [calculo]);
    
    const calcular = () => {
        const km = toNumber(watch(`km_${calculoIndex}`));
        const hp = toNumber(watch(`hp_${calculoIndex}`));
        
        if(isNaN(km) || isNaN(hp)) {
            setResultado("Não foi possível calcular");
        } else {
            let resultado = (((km * calculo.bandeira) + calculo.bandeirada) + hp);
            let desconto = calculo.desconto ? (calculo.desconto / 100) * resultado : 0;
            resultado = resultado - desconto;
            resultado.toFixed(2);
            setResultado("R$ " + toText(resultado));
        }
    };

    return (
        <CardsContainer>
            <h3>
                <i className="fa-solid fa-calculator"></i>
                {calculo.nomeCalculo}
            </h3>
            <Form onSubmit={handleSubmit(calcular)}>
                <div className='inputs'>
                    <label htmlFor={`km_${calculoIndex}`}>KM</label>
                    <Input maxLength={6} {...register(`km_${calculoIndex}`)} type="text" id={`km_${calculoIndex}`} />
                    x <span>{toText(calculo.bandeira)}</span> + <span>{toText(calculo.bandeirada)}</span> +
                    <label htmlFor={`hp_${calculoIndex}`}>HP</label>
                    <Input maxLength={6} {...register(`hp_${calculoIndex}`)} type="text" id={`hp_${calculoIndex}`} />
                    {calculo.desconto && <span className='desconto'>- {calculo.desconto}%</span>}
                </div>
                <div className='enviar'>
                    <p>Resultado: <span className='result'>{resultado}</span></p>
                    <button type='submit'>Calcular</button>
                </div>
            </Form>
        </CardsContainer>
    )
}

export default Card