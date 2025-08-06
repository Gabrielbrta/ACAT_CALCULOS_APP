import React from 'react'
import styled from 'styled-components'

const Titulo = styled.h1 `
    font-size: ${({theme}) => theme.text.titleSize};
    color: ${({theme}) => theme.color.title};
`

const Subtitulo = styled.h2 `
    font-size: ${({theme}) => theme.text.titleH2Size};
    color: ${({theme}) => theme.color.subtitle};
`

const Title = ({children}) => {
  return (
    <Titulo>{children}</Titulo>
    )
}

const Subtitle = ({children}) => {
  return (
    <Subtitulo>{children}</Subtitulo>
  )
}

export  {Title, Subtitle};