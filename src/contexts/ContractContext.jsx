import React, { createContext, useContext, useState, useEffect } from 'react';

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
    await window.Api.SalvarContrato(data);
    await loadContratos(); // Recarrega os contratos após salvar
  };

  const updateContrato = async (id, data) => {
    await window.Api.AtualizarContrato(id, data);
    await loadContratos(); // Recarrega os contratos após atualizar
  };

  const deleteContrato = async (id) => {
    await window.Api.DeletarContrato(id);
    await loadContratos(); // Recarrega os contratos após deletar
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
