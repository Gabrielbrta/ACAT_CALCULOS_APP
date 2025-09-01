import React, { useEffect } from 'react'
import styled from 'styled-components';
import { Subtitle } from './Title';
import List from './List';

const ContainerMenu = styled.aside`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${({theme}) => theme.color.bgColorElements};
  padding: 20px 0px;
  text-align: center;

`

const ContainerLists = styled.div `
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 90%;
  width: 100%;
`


const Menu = ({setCardContent, contratos}) => {

  return (
    <ContainerMenu>
      <Subtitle>Contratos</Subtitle>
      <ContainerLists>
        <List setCardContent={setCardContent} contratos={contratos}></List>
      <List title={"Funcionalidades"} items={["Simulador"]}></List>
      </ContainerLists>
    </ContainerMenu>
  )
}

export default Menu;