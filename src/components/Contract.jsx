import React from 'react'
import styled from 'styled-components';
import {Title} from './Title';
import Card from './Card';

const ContractContainer = styled.section`
    width: 100%;
    display: flex;
    height: 100%;
    flex-direction: column; 
    justify-content: center;
    align-items: center;
    padding: 30px 10px;
    gap: 30px;

`



const Contract = () => {
  return (
    <ContractContainer>
      <Title>CONTRATO: localstorage</Title>
      <Card />
      <Card />
    </ContractContainer>
  )
}

export default Contract