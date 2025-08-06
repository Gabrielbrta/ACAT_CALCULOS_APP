import React from 'react'
import styled from 'styled-components'

const Btn = styled.button`
    background-color: ${({theme}) => theme.color.button};
    border: none;
    padding: ${({theme}) => theme.spacing.buttonPadding};
    font-size: ${({theme}) => theme.text.textSize};
    color: white;
    cursor: pointer;
    border-radius: 5px;
    transition: .3s;
    margin: 20px 0px;

    &:hover {
        background: ${({theme}) => theme.color.buttonHover}
    }
`

const Button = ({children}) => {
  return (
    <Btn>{children}</Btn>
  )
}

export default Button