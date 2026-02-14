import React from 'react'
import styled from 'styled-components';
import {Title} from './Title';
import Card from './Card';
import { useContract } from '../contexts/ContractContext';

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
  const { cardContent, getContratoById } = useContract();
  const contrato = cardContent ? getContratoById(cardContent) : null;

  return (
    <ContractContainer>
      {contrato && 
      <>
        <Title>CONTRATO: {contrato.nomeContrato}</Title>
        <Card contrato={contrato}/>
      </>
      }
      {!contrato && <Title>Selecione o contrato</Title>}
      
    </ContractContainer>
  )
}

export default Contract