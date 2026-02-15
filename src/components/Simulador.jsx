import React from 'react'
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  width: 100%;
  height: 100vh;
  padding: 40px;
  background-color: ${({theme}) => theme.color.bgPage};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: ${({theme}) => theme.color.subtitle};
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: ${({theme}) => theme.borderRadius.medium};
  transition: all 0.2s ease;
  position: absolute;
  top: 40px;
  left: 40px;
  
  &:hover {
    color: ${({theme}) => theme.color.title};
    background-color: ${({theme}) => theme.color.bgHover};
  }
`;

const Simulador = () => {
  const navigate = useNavigate();
  
  return (
    <Container>
      <BackButton onClick={() => navigate('/')}>
        <i className="fa-solid fa-arrow-left"></i> Voltar
      </BackButton>
    </Container>
  )
}

export default Simulador;