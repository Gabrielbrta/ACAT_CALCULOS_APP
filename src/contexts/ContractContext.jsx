import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const ContractContext = createContext();

export const ContractProvider = ({ children }) => {
  const [contratos, setContratos] = useState([]);
  const [cardContent, setCardContent] = useState("");

  // Carrega contratos ao iniciar
  useEffect(() => {
    loadContratos();
  }, []);

  const loadContratos = async () => {
    const data = await window.Api.PegarContratos();
    setContratos(data);
  };

  const saveContrato = async (data) => {
    try {
      await window.Api.SalvarContrato(data);
      await loadContratos();
      toast.success('Contrato cadastrado com sucesso!', {
        icon: '✅'
      });
    } catch (error) {
      toast.error('Erro ao cadastrar contrato!');
      console.error(error);
    }
  };

  const updateContrato = async (id, data) => {
    try {
      await window.Api.AtualizarContrato(id, data);
      await loadContratos();
      toast.success('Contrato atualizado com sucesso!', {
        icon: '✏️'
      });
    } catch (error) {
      toast.error('Erro ao atualizar contrato!');
      console.error(error);
    }
  };

  const deleteContrato = async (id) => {
    try {
      await window.Api.DeletarContrato(id);
      await loadContratos();
      toast.success('Contrato excluído com sucesso!', {
        icon: '🗑️'
      });
    } catch (error) {
      toast.error('Erro ao excluir contrato!');
      console.error(error);
    }
  };

  const getContratoById = (id) => {
    return contratos.find(c => c.id === id);
  };

  return (
    <ContractContext.Provider 
      value={{
        contratos,
        cardContent,
        setCardContent,
        saveContrato,
        updateContrato,
        deleteContrato,
        loadContratos,
        getContratoById,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};

// Hook customizado para usar o contexto
export const useContract = () => {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error('useContract deve ser usado dentro de ContractProvider');
  }
  return context;
};
