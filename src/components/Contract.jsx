import React from 'react'
import styled from 'styled-components';
import {Title} from './Title';
import Card from './Card';
import { useContract } from '../contexts/ContractContext';
import PageHeader from './PageHeader';

const ContractContainer = styled.section`
    width: 100%;
    display: flex;
    height: 100vh;
    flex-direction: column;
    padding: 30px;
    background-color: ${({theme}) => theme.color.bgPage};
    overflow-y: auto;
`

const HeaderWrapper = styled.div`
    width: 100%;
    margin-bottom: 24px;
`

const CardsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    gap: 20px;
    max-height: calc(100vh - 200px);
    overflow-y: auto;
    padding-right: 10px;
    
    &::-webkit-scrollbar {
        width: 8px;
    }
    
    &::-webkit-scrollbar-track {
        background: ${({theme}) => theme.color.bgHover};
        border-radius: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
        background: ${({theme}) => theme.color.border};
        border-radius: 4px;
        
        &:hover {
            background: ${({theme}) => theme.color.borderDark};
        }
    }
`

const EmptyState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 60vh;
    color: ${({theme}) => theme.color.subtitle};
    
    i {
        font-size: 4rem;
        margin-bottom: 16px;
        opacity: 0.3;
    }
    
    p {
        font-size: 1.1rem;
        margin: 0;
    }
`

const Contract = () => {
  const { cardContent, getContratoById } = useContract();
  const contrato = cardContent ? getContratoById(cardContent) : null;

  // Compatibilidade com contratos antigos
  const calculos = contrato ? (contrato.calculos || [
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
  ]) : [];

  return (
    <ContractContainer>
      {contrato ? (
        <>
          <HeaderWrapper>
            <PageHeader 
              title={`Contrato: ${contrato.nomeContrato}`}
              breadcrumbs={[
                { label: 'Início' },
                { label: contrato.nomeContrato }
              ]}
            />
          </HeaderWrapper>
          <CardsGrid>
            {calculos.map((calculo, index) => (
              <Card 
                key={index}
                contrato={contrato}
                calculo={calculo}
                calculoIndex={index}
              />
            ))}
          </CardsGrid>
        </>
      ) : (
        <>
          <HeaderWrapper>
            <PageHeader 
              title="Bem-vindo ao TaxiCalc Pro"
              breadcrumbs={[
                { label: 'Início' }
              ]}
            />
          </HeaderWrapper>
          <EmptyState>
            <i className="fa-solid fa-taxi"></i>
            <p>Selecione um contrato no menu lateral para começar</p>
          </EmptyState>
        </>
      )}
    </ContractContainer>
  )
}

export default Contract