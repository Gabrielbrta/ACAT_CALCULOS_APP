import React from 'react'
import styled from 'styled-components';
import { useNavigate  } from "react-router-dom";
import { Subtitle } from './Title';

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


const List = ({title, items, contratos, setCardContent}) => {
    const navigate = useNavigate();
  return (
    <ListContainer>
        {title && <Subtitle>{title}</Subtitle>}
        {items && items.map((item, i) => {
            return (
                <>
                {item.id ?
                <ListItem onClick={() => {setCardContent(item.id); navigate('/')  }} key={i}>{item}</ListItem> : 
                <ListItem onClick={() => {navigate("/simulador") }} key={i}>{item}</ListItem>}
                
            </>
        )
        })}
        {contratos && contratos.map((contrato, i) => {
            return <ListItem key={i} id={contrato.id} onClick={() => setCardContent(contrato.id)}>{contrato.nomeContrato}</ListItem>
        })}
    </ListContainer>
  )
}

export default List;