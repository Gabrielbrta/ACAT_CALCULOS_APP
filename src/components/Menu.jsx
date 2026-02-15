import React from 'react'
import styled from 'styled-components';
import { Subtitle } from './Title';
import List from './List';

const ContainerMenu = styled.aside`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${({theme}) => theme.color.bgSidebar};
  padding: 30px 0px;
  text-align: center;
  box-shadow: 2px 0 8px ${({theme}) => theme.color.shadow};
`

const Logo = styled.div`
  color: ${({theme}) => theme.color.textOnDark};
  font-size: 1.5rem;
  font-weight: ${({theme}) => theme.font.wheightBold};
  padding: 0 20px;
  margin-bottom: 40px;
  letter-spacing: 2px;
`

const ContainerLists = styled.div `
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 90%;
  width: 100%;
`


const Menu = () => {
  return (
    <ContainerMenu>
      <Logo>TaxiCalc Pro</Logo>
      <ContainerLists>
        <List title={"Funcionalidades"} items={["Gerenciar Contratos", "Simulador"]} />
      </ContainerLists>
    </ContainerMenu>
  )
}

export default Menu;