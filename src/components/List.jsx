import React from 'react'
import styled from 'styled-components';
import { useNavigate  } from "react-router-dom";
import { Subtitle } from './Title';
import { useContract } from '../contexts/ContractContext';

const ListContainer = styled.ul `
    list-style-type: none;
    width:100%;
    display: flex;
    flex-direction: column;
    margin: 20px 0px;
    li:first-of-type {
        border-top: 1px solid #b9b9b9;
    }

    overflow-y: auto;
    max-height: 30%;
`
const ListItem = styled.li `
    li + li {
    border-top: 1px solid #b9b9b9;

    }
    
    padding: 10px;
    border-bottom: 1px solid #b9b9b9;
    cursor: pointer;
    transition: .3s;
    &:hover {
        background-color: #b9b9b9
    }   
`


const List = ({title, items}) => {
    const navigate = useNavigate();
    const { contratos, setCardContent } = useContract();

  return (
    <ListContainer>
        {title && <Subtitle>{title}</Subtitle>}
        {items && items.map((item, i) => {
            return (
                <React.Fragment key={i}>
                {item.id ?
                <ListItem onClick={() => {setCardContent(item.id); navigate('/')  }}>{item}</ListItem> : 
                <ListItem onClick={() => {navigate("/simulador") }}>{item}</ListItem>}
                
            </React.Fragment>
        )
        })}
        {!items && contratos && contratos.map((contrato, i) => {
            return <ListItem key={i} id={contrato.id} onClick={() => setCardContent(contrato.id)}>{contrato.nomeContrato}</ListItem>
        })}
    </ListContainer>
  )
}

export default List;