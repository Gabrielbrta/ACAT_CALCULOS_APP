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



const Contract = ({idContrato, setCardContract}) => {
   const [contrato, setContrato] = React.useState(false);
    React.useEffect(() => {
        if(idContrato) {
            window.Api.PegarContratos().then((dados) => {
                const idEncotrado = dados.find(c => c.id === idContrato)
                setContrato(idEncotrado);
            });
    
        }
    }, [idContrato])

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