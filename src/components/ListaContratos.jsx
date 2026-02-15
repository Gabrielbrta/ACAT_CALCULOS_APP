import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { useContract } from '../contexts/ContractContext';
import { Title, Subtitle } from './Title';
import Btn from './Button';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  width: 100%;
  height: 100vh;
  padding: 40px;
  overflow-y: auto;
  background-color: #f5f5f5;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  
  .back-button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
    color: ${({theme}) => theme.color.subtitle};
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    
    &:hover {
      color: ${({theme}) => theme.color.title};
    }
  }
`;

const SearchBar = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  
  input {
    flex: 1;
    padding: 12px 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;
    
    &:focus {
      outline: none;
      border-color: ${({theme}) => theme.color.button};
    }
  }
`;

const Table = styled.table`
  width: 100%;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border-collapse: collapse;
  
  thead {
    background-color: ${({theme}) => theme.color.button};
    color: white;
    
    th {
      padding: 15px;
      text-align: left;
      font-weight: 600;
    }
  }
  
  tbody {
    tr {
      border-bottom: 1px solid #eee;
      transition: background 0.2s;
      
      &:hover {
        background-color: #f9f9f9;
      }
      
      td {
        padding: 15px;
      }
    }
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
  
  button {
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.2s;
    
    &.edit {
      background-color: #ffc107;
      color: #000;
      
      &:hover {
        background-color: #ffb300;
      }
    }
    
    &.delete {
      background-color: #dc3545;
      color: white;
      
      &:hover {
        background-color: #c82333;
      }
    }
    
    &.view {
      background-color: #17a2b8;
      color: white;
      
      &:hover {
        background-color: #138496;
      }
    }
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 30px;
  
  button {
    padding: 8px 16px;
    border: 1px solid #ddd;
    background: white;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover:not(:disabled) {
      background-color: ${({theme}) => theme.color.button};
      color: white;
      border-color: ${({theme}) => theme.color.button};
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    &.active {
      background-color: ${({theme}) => theme.color.button};
      color: white;
      border-color: ${({theme}) => theme.color.button};
    }
  }
  
  span {
    color: ${({theme}) => theme.color.subtitle};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${({theme}) => theme.color.subtitle};
  
  i {
    font-size: 4rem;
    margin-bottom: 20px;
    opacity: 0.3;
  }
  
  h3 {
    margin-bottom: 10px;
  }
`;

const ListaContratos = () => {
  const navigate = useNavigate();
  const { contratos, deleteContrato, setCardContent } = useContract();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtrar contratos baseado na busca
  const filteredContratos = useMemo(() => {
    if (!searchTerm) return contratos;
    
    return contratos.filter(contrato =>
      contrato.nomeContrato.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [contratos, searchTerm]);

  // Paginação
  const totalPages = Math.ceil(filteredContratos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentContratos = filteredContratos.slice(startIndex, endIndex);

  const handleDelete = async (id, nome) => {
    if (window.confirm(`Deseja realmente excluir o contrato "${nome}"?`)) {
      await deleteContrato(id);
    }
  };

  const handleView = (id) => {
    setCardContent(id);
    navigate('/');
  };

  const handleEdit = (contrato) => {
    // TODO: Implementar modal de edição
    alert('Funcionalidade de edição será implementada em breve!');
  };

  return (
    <Container>
      <Header>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button className="back-button" onClick={() => navigate('/')}>
            <i className="fa-solid fa-arrow-left"></i>
            Voltar
          </button>
          <Title>Gerenciar Contratos</Title>
        </div>
      </Header>

      <SearchBar>
        <input
          type="text"
          placeholder="Buscar contrato por nome..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset para primeira página ao buscar
          }}
        />
      </SearchBar>

      {currentContratos.length === 0 ? (
        <EmptyState>
          <i className="fa-solid fa-folder-open"></i>
          <h3>Nenhum contrato encontrado</h3>
          <p>
            {searchTerm 
              ? 'Tente buscar com outro termo.' 
              : 'Crie seu primeiro contrato para começar.'}
          </p>
        </EmptyState>
      ) : (
        <>
          <Table>
            <thead>
              <tr>
                <th>Nome do Contrato</th>
                <th>Quantidade de Cálculos</th>
                <th>Tipos de Cálculos</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {currentContratos.map((contrato) => {
                // Retrocompatibilidade: se não tiver calculos[], criar baseado nos dados antigos
                const calculos = contrato.calculos || [
                  { nomeCalculo: 'Bandeira 1' },
                  ...(contrato.hasBandeira2 ? [{ nomeCalculo: 'Bandeira 2' }] : [])
                ];
                
                return (
                  <tr key={contrato.id}>
                    <td><strong>{contrato.nomeContrato}</strong></td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ 
                        background: '#e8f4f8', 
                        padding: '4px 12px', 
                        borderRadius: '12px',
                        fontWeight: 'bold',
                        color: '#0066cc'
                      }}>
                        {calculos.length}
                      </span>
                    </td>
                    <td>
                      {calculos.map((calc, idx) => (
                        <span key={idx} style={{ 
                          display: 'inline-block',
                          background: '#f0f0f0',
                          padding: '3px 10px',
                          borderRadius: '4px',
                          marginRight: '5px',
                          marginBottom: '5px',
                          fontSize: '0.85rem'
                        }}>
                          {calc.nomeCalculo}
                        </span>
                      ))}
                    </td>
                    <td>
                      <Actions>
                        <button 
                          className="view" 
                          onClick={() => handleView(contrato.id)}
                          title="Visualizar"
                        >
                          <i className="fa-solid fa-eye"></i>
                        </button>
                        <button 
                          className="edit" 
                          onClick={() => handleEdit(contrato)}
                          title="Editar"
                        >
                          <i className="fa-solid fa-pen"></i>
                        </button>
                        <button 
                          className="delete" 
                          onClick={() => handleDelete(contrato.id, contrato.nomeContrato)}
                          title="Excluir"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </Actions>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>

          {totalPages > 1 && (
            <Pagination>
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <i className="fa-solid fa-chevron-left"></i> Anterior
              </button>
              
              <span>
                Página {currentPage} de {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Próxima <i className="fa-solid fa-chevron-right"></i>
              </button>
            </Pagination>
          )}
        </>
      )}
    </Container>
  );
};

export default ListaContratos;
