import React from 'react'
import styled from 'styled-components';

const CardsContainer = styled.div `
    display: flex;
    flex-direction: column;
    align-items: left;
    background-color: ${({theme}) => theme.color.bgColorElements};
    max-width: 376px;
    box-shadow: 2px 2px 7px rgba(0, 0, 0, 0.25);
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

    
`

const Card = () => {
  return (
        <CardsContainer>
            <p>Bandeira 1</p>
            <Form action="">
            <label htmlFor="bandeira1">KM</label>
            <Input type="text" id="bandeira1" />
            x <span>b1</span> + <span>bda1</span> + 
            <label htmlFor="hp">HP</label>
            <Input type="text" id="hp" />
            - <span className='desconto'>5%</span>
            </Form>
            <p>Resultado: <span className='result'>R$12,30</span></p>
        </CardsContainer>
  )
}

export default Card