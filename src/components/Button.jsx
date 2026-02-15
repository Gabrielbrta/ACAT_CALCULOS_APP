import React from 'react'
import styled from 'styled-components'

const Btn = styled.button`
    background-color: ${({theme}) => theme.color.button};
    border: none;
    padding: ${({theme}) => theme.spacing.buttonPadding};
    font-size: ${({theme}) => theme.text.textSize};
    color: ${({theme}) => theme.color.buttonText};
    cursor: pointer;
    border-radius: ${({theme}) => theme.borderRadius.medium};
    transition: all 0.2s ease;
    margin: 16px 0px;
    font-weight: ${({theme}) => theme.font.wheightH3};
    box-shadow: ${({theme}) => theme.shadow.small};

    &:hover {
        background: ${({theme}) => theme.color.buttonHover};
        box-shadow: ${({theme}) => theme.shadow.medium};
        transform: translateY(-1px);
    }
    
    &:active {
        transform: translateY(0);
    }
`

const Button = ({children}) => {
  return (
    <Btn>{children}</Btn>
  )
}

export default Button