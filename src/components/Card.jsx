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

const Select = styled.select`
    width: 100%;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #acacac;
    margin-bottom: 15px;
    font-size: ${({theme}) => theme.text.textSize};
    background-color: white;
    cursor: pointer;
    
    &:focus {
        outline: none;
        border-color: ${({theme}) => theme.color.button};
    }
`;

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
    const {register, handleSubmit, watch, reset} = useForm();
    const [calculoSelecionado, setCalculoSelecionado] = React.useState(0);
    const [resultado, setResultado] = React.useState(0);
    
    function toText(number) {return String(number.toFixed(2)).replace(".", ",");}
    function toNumber(text) {return Number(String(text).replace(",", "."));}

    React.useEffect(() => {
        reset();
        setResultado(0);
        setCalculoSelecionado(0);
    }, [contrato]);
    
    const calcular = () => {
        const calculoAtual = contrato.calculos[calculoSelecionado];
        const km = toNumber(watch('km'));
        const hp = toNumber(watch('hp'));
        
        if(isNaN(km) || isNaN(hp)) {
            setResultado("Não foi possível calcular");
        } else {
            let resultado = (((km * calculoAtual.bandeira) + calculoAtual.bandeirada) + hp);
            let desconto = calculoAtual.desconto ? (calculoAtual.desconto / 100) * resultado : 0;
            resultado = resultado - desconto;
            resultado.toFixed(2);
            setResultado("R$ " + toText(resultado));
        }
    };

    // Compatibilidade com contratos antigos (bandeira1/bandeira2)
    const calculos = contrato.calculos || [
        {
            nomeCalculo: 'Bandeira 1',
            bandeira: contrato.bandeira1,
            bandeirada: contrato.bandeirada1,
            desconto: contrato.desconto1
        },
        ...(contrato.hasBandeira2 ? [{
            nomeCalculo: 'Bandeira 2',
            bandeira: contrato.bandeira2,
            bandeirada: contrato.bandeirada2,
            desconto: contrato.desconto2
        }] : [])
    ];

    const calculoAtual = calculos[calculoSelecionado];

    return (
        <CardsContainer>
            {calculos.length > 1 && (
                <Select 
                    value={calculoSelecionado} 
                    onChange={(e) => {
                        setCalculoSelecionado(Number(e.target.value));
                        setResultado(0);
                    }}
                >
                    {calculos.map((calc, index) => (
                        <option key={index} value={index}>
                            {calc.nomeCalculo}
                        </option>
                    ))}
                </Select>
            )}
            
            <p><strong>{calculoAtual.nomeCalculo}</strong></p>
            <Form onSubmit={handleSubmit(calcular)}>
                <div className='inputs'>
                    <label htmlFor="km">KM</label>
                    <Input maxLength={6} {...register("km")} type="text" id="km" />
                    x <span>{toText(calculoAtual.bandeira)}</span> + <span>{toText(calculoAtual.bandeirada)}</span> +
                    <label htmlFor="hp">HP</label>
                    <Input maxLength={6} {...register("hp")} type="text" id="hp" />
                    {calculoAtual.desconto && <span className='desconto'>- {calculoAtual.desconto}%</span>}
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