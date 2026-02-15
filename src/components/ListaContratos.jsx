import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { useContract } from '../contexts/ContractContext';
import { Title, Subtitle } from './Title';
import Btn from './Button';
import { useNavigate } from 'react-router-dom';
import PageHeader from './PageHeader';

const Container = styled.div`
  width: 100%;
  height: 100vh;
  padding: 30px;
  overflow-y: auto;
  background-color: ${({theme}) => theme.color.bgPage};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  
  .back-button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 0.9rem;
    color: ${({theme}) => theme.color.subtitle};
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    border-radius: ${({theme}) => theme.borderRadius.medium};
    transition: all 0.2s ease;
    
    &:hover {
      color: ${({theme}) => theme.color.title};
      background-color: ${({theme}) => theme.color.bgHover};
    }
  }
`;

const SearchBar = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  align-items: center;
  
  input {
    flex: 1;
    padding: ${({theme}) => theme.spacing.inputPadding};
    border: 1px solid ${({theme}) => theme.color.border};
    border-radius: ${({theme}) => theme.borderRadius.medium};
    font-size: ${({theme}) => theme.text.textSize};
    transition: all 0.2s ease;
    
    &:focus {
      outline: none;
      border-color: ${({theme}) => theme.color.primary};
      box-shadow: 0 0 0 3px rgba(30, 58, 95, 0.1);
    }
  }
  
  .add-button {
    padding: ${({theme}) => theme.spacing.buttonPadding};
    background-color: ${({theme}) => theme.color.button};
    color: ${({theme}) => theme.color.buttonText};
    border: none;
    border-radius: ${({theme}) => theme.borderRadius.medium};
    font-size: ${({theme}) => theme.text.textSize};
    font-weight: ${({theme}) => theme.font.wheightH3};
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s ease;
    white-space: nowrap;
    box-shadow: ${({theme}) => theme.shadow.small};
    
    &:hover {
      background-color: ${({theme}) => theme.color.buttonHover};
      transform: translateY(-1px);
      box-shadow: ${({theme}) => theme.shadow.medium};
    }
    
    &:active {
      transform: translateY(0);
    }
    
    i {
      font-size: 0.95rem;
    }
  }
`;

const Table = styled.table`
  width: 100%;
  background: ${({theme}) => theme.color.bgTable};
  border-radius: ${({theme}) => theme.borderRadius.large};
  overflow: hidden;
  box-shadow: ${({theme}) => theme.shadow.medium};
  border-collapse: collapse;
  border: 1px solid ${({theme}) => theme.color.border};
  
  thead {
    background-color: ${({theme}) => theme.color.bgTableHeader};
    color: ${({theme}) => theme.color.textOnDark};
    
    th {
      padding: 12px;
      text-align: left;
      font-weight: ${({theme}) => theme.font.wheightBold};
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  }
  
  tbody {
    tr {
      border-bottom: 1px solid ${({theme}) => theme.color.border};
      transition: background 0.2s ease;
      
      &:hover {
        background-color: ${({theme}) => theme.color.bgHover};
      }
      
      &:last-child {
        border-bottom: none;
      }
      
      td {
        padding: 12px;
        color: ${({theme}) => theme.color.text};
        font-size: ${({theme}) => theme.text.textSize};
      }
    }
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 6px;
  
  button {
    padding: 6px 10px;
    border: none;
    border-radius: ${({theme}) => theme.borderRadius.small};
    cursor: pointer;
    font-size: 0.85rem;
    transition: all 0.2s ease;
    box-shadow: ${({theme}) => theme.shadow.small};
    
    &.edit {
      background-color: ${({theme}) => theme.color.warning};
      color: ${({theme}) => theme.color.textOnDark};
      
      &:hover {
        background-color: ${({theme}) => theme.color.warningHover};
        transform: translateY(-1px);
      }
    }
    
    &.delete {
      background-color: ${({theme}) => theme.color.danger};
      color: ${({theme}) => theme.color.textOnDark};
      
      &:hover {
        background-color: ${({theme}) => theme.color.dangerHover};
        transform: translateY(-1px);
      }
    }
    
    &.view {
      background-color: ${({theme}) => theme.color.info};
      color: ${({theme}) => theme.color.textOnDark};
      
      &:hover {
        background-color: ${({theme}) => theme.color.infoHover};
        transform: translateY(-1px);
      }
    }
    
    &:active {
      transform: translateY(0);
    }
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  
  button {
    padding: 8px 14px;
    border: 1px solid ${({theme}) => theme.color.border};
    background: ${({theme}) => theme.color.bgColorElements};
    border-radius: ${({theme}) => theme.borderRadius.medium};
    cursor: pointer;
    transition: all 0.2s ease;
    color: ${({theme}) => theme.color.text};
    font-weight: ${({theme}) => theme.font.wheightH3};
    font-size: ${({theme}) => theme.text.smallSize};
    
    &:hover:not(:disabled) {
      background-color: ${({theme}) => theme.color.button};
      color: ${({theme}) => theme.color.buttonText};
      border-color: ${({theme}) => theme.color.button};
      transform: translateY(-1px);
      box-shadow: ${({theme}) => theme.shadow.small};
    }
    
    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    
    &.active {
      background-color: ${({theme}) => theme.color.button};
      color: ${({theme}) => theme.color.buttonText};
      border-color: ${({theme}) => theme.color.button};
    }
  }
  
  span {
    color: ${({theme}) => theme.color.text};
    font-weight: ${({theme}) => theme.font.wheightH3};
    font-size: ${({theme}) => theme.text.smallSize};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 50px 20px;
  color: ${({theme}) => theme.color.subtitle};
  background: ${({theme}) => theme.color.bgColorElements};
  border-radius: ${({theme}) => theme.borderRadius.large};
  border: 2px dashed ${({theme}) => theme.color.border};
  
  i {
    font-size: 3.5rem;
    margin-bottom: 16px;
    opacity: 0.3;
    color: ${({theme}) => theme.color.primary};
  }
  
  h3 {
    margin-bottom: 8px;
    color: ${({theme}) => theme.color.title};
    font-weight: ${({theme}) => theme.font.wheightBold};
    font-size: 1.1rem;
  }
  
  p {
    color: ${({theme}) => theme.color.subtitle};
    font-size: ${({theme}) => theme.text.smallSize};
  }
`;

const Badge = styled.span`
  background: ${({theme}) => theme.color.primary};
  color: ${({theme}) => theme.color.textOnDark};
  padding: 3px 10px;
  border-radius: 12px;
  font-weight: ${({theme}) => theme.font.wheightBold};
  font-size: 0.85rem;
`;

const Tag = styled.span`
  display: inline-block;
  background: ${({theme}) => theme.color.bgHover};
  color: ${({theme}) => theme.color.text};
  padding: 3px 8px;
  border-radius: ${({theme}) => theme.borderRadius.small};
  margin-right: 5px;
  margin-bottom: 5px;
  font-size: 0.8rem;
  border: 1px solid ${({theme}) => theme.color.border};
`;

const ListaContratos = () => {
  const navigate = useNavigate();
  const { contratos, deleteContrato, setCardContent } = useContract();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Debounce do searchTerm
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 200);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filtrar contratos baseado na busca com debounce
  const filteredContratos = useMemo(() => {
    if (!debouncedSearchTerm) return contratos;
    
    return contratos.filter(contrato =>
      contrato.nomeContrato.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [contratos, debouncedSearchTerm]);

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
    navigate(`/editar-contrato/${contrato.id}`, { state: { contrato } });
  };

  return (
    <Container>
      <Header>
        <button className="back-button" onClick={() => navigate('/')}>
          <i className="fa-solid fa-arrow-left"></i>
          Voltar
        </button>
      </Header>
      
      <PageHeader 
        title="Gerenciar Contratos" 
        breadcrumbs={[
          { label: 'Início', path: '/' },
          { label: 'Contratos' }
        ]}
      />

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
        <button 
          className="add-button" 
          onClick={() => navigate('/adicionar-contrato')}
          title="Novo Contrato"
        >
          <i className="fa-solid fa-plus"></i>
          Novo Contrato
        </button>
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
                      <Badge>{calculos.length}</Badge>
                    </td>
                    <td>
                      {calculos.map((calc, idx) => (
                        <Tag key={idx}>
                          {calc.nomeCalculo}
                        </Tag>
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
