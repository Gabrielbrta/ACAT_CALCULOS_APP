import React, { useState, useRef } from 'react'
import styled from 'styled-components';
import { useNavigate  } from "react-router-dom";
import { useContract } from '../contexts/ContractContext';

const ListTitle = styled.h3`
    color: ${({theme}) => theme.color.textLight};
    font-size: 0.75rem;
    font-weight: ${({theme}) => theme.font.wheightBold};
    text-transform: uppercase;
    letter-spacing: 1px;
    padding: 0 20px;
    margin-bottom: 10px;
`

const ListContainer = styled.ul `
    list-style-type: none;
    width: 100%;
    display: flex;
    flex-direction: column;
`

const ListItem = styled.li `
    padding: 14px 20px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: ${({theme}) => theme.color.textOnDark};
    font-size: 0.95rem;
    position: relative;
    
    &:before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 3px;
        background-color: transparent;
        transition: background-color 0.2s ease;
    }
    
    &:hover {
        background-color: ${({theme}) => theme.color.primaryLight};
        
        &:before {
            background-color: ${({theme}) => theme.color.accent};
        }
    }   
`

const SubmenuContainer = styled.div`
    position: absolute;
    left: 100%;
    top: 0;
    min-width: 250px;
    max-width: 300px;
    max-height: 400px;
    background-color: ${({theme}) => theme.color.bgSidebar};
    box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.25);
    border: 1px solid ${({theme}) => theme.color.primaryDark};
    border-radius: 0px 5px 5px 0px;
    overflow-y: auto;
    z-index: 10;
    display: ${({show}) => show ? 'block' : 'none'};
    margin-left: -1px;
    transition: none;
    
    &::-webkit-scrollbar {
        width: 6px;
    }
    
    &::-webkit-scrollbar-track {
        background: transparent;
        border-radius: 3px;
    }
    
    &::-webkit-scrollbar-thumb {
        background: ${({theme}) => theme.color.border};
        border-radius: 3px;
        
        &:hover {
            background: ${({theme}) => theme.color.borderDark};
        }
    }
`

const SubmenuItem = styled.div`
    padding: 12px 16px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: ${({theme}) => theme.color.textOnDark};
    font-size: 0.9rem;
    background-color: transparent;
    border-bottom: 1px solid ${({theme}) => theme.color.primaryDark};
    white-space: nowrap;
    z-index: 12;
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    
    &:last-child {
        border-bottom: none;
    }
    
    &:hover {
        background-color: ${({theme}) => theme.color.primaryLight};
        color: ${({theme}) => theme.color.textOnDark};
        font-weight: ${({theme}) => theme.font.wheightH3};
    }
`

const SubmenuHeader = styled.div`
    padding: 12px 16px;
    font-size: 0.75rem;
    font-weight: ${({theme}) => theme.font.wheightBold};
    text-transform: uppercase;
    letter-spacing: 1px;
    color: ${({theme}) => theme.color.textLight};
    background-color: ${({theme}) => theme.color.primaryDark};
    border-bottom: 2px solid ${({theme}) => theme.color.primaryLight};
    position: sticky;
    top: 0;
    z-index: 10;
`


const List = ({title, items}) => {
    const navigate = useNavigate();
    const { contratos, setCardContent } = useContract();
    const [showSubmenu, setShowSubmenu] = useState(false);
    const menuItemRef = useRef(null);
    const submenuRef = useRef(null);
    const checkTimeoutRef = useRef(null);

    const isMouseOverMenuArea = (e) => {
        if (!menuItemRef.current && !submenuRef.current) return false;
        
        const menuRect = menuItemRef.current?.getBoundingClientRect();
        const submenuRect = submenuRef.current?.getBoundingClientRect();
        
        const isOverMenuItem = menuRect && 
            e.clientX >= menuRect.left && 
            e.clientX <= menuRect.right && 
            e.clientY >= menuRect.top && 
            e.clientY <= menuRect.bottom;
            
        const isOverSubmenu = submenuRect && 
            e.clientX >= submenuRect.left && 
            e.clientX <= submenuRect.right && 
            e.clientY >= submenuRect.top && 
            e.clientY <= submenuRect.bottom;
            
        return isOverMenuItem || isOverSubmenu;
    };

    const handleMouseMove = (e) => {
        if (checkTimeoutRef.current) {
            clearTimeout(checkTimeoutRef.current);
        }
        
        checkTimeoutRef.current = setTimeout(() => {
            if (!isMouseOverMenuArea(e)) {
                setShowSubmenu(false);
            }
        }, 100);
    };

    const handleMouseEnter = () => {
        setShowSubmenu(true);
        document.addEventListener('mousemove', handleMouseMove);
    };

    const handleMouseLeaveArea = () => {
        if (checkTimeoutRef.current) {
            clearTimeout(checkTimeoutRef.current);
        }
        checkTimeoutRef.current = setTimeout(() => {
            setShowSubmenu(false);
            document.removeEventListener('mousemove', handleMouseMove);
        }, 150);
    };

    React.useEffect(() => {
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            if (checkTimeoutRef.current) {
                clearTimeout(checkTimeoutRef.current);
            }
        };
    }, []);

    const handleContratoClick = (contrato) => {
        setCardContent(contrato.id);
        setShowSubmenu(false);
        document.removeEventListener('mousemove', handleMouseMove);
        if (checkTimeoutRef.current) {
            clearTimeout(checkTimeoutRef.current);
        }
        navigate("/");
    };

  return (
    <>
        {title && <ListTitle>{title}</ListTitle>}
        <ListContainer>
            {items && items.map((item, i) => {
                return (
                    <React.Fragment key={i}>
                    {item === "Simulador" ?
                    <ListItem onClick={() => {navigate("/simulador") }}>{item}</ListItem> :
                    item === "Gerenciar Contratos" ?
                    <ListItem 
                        ref={menuItemRef}
                        onClick={() => {navigate("/contratos") }}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeaveArea}
                    >
                        {item}
                        <SubmenuContainer 
                            ref={submenuRef}
                            show={showSubmenu}
                            onMouseLeave={handleMouseLeaveArea}
                        >
                            <SubmenuHeader>
                                Contratos ({contratos.length})
                            </SubmenuHeader>
                            {contratos.length > 0 ? (
                                contratos.map((contrato) => (
                                    <SubmenuItem 
                                        key={contrato.id}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleContratoClick(contrato);
                                        }}
                                    >
                                        {contrato.nomeContrato}
                                    </SubmenuItem>
                                ))
                            ) : (
                                <SubmenuItem style={{ cursor: 'default', color: '#999' }}>
                                    Nenhum contrato cadastrado
                                </SubmenuItem>
                            )}
                        </SubmenuContainer>
                    </ListItem> :
                    item === "Adicionar Contrato" ?
                    <ListItem onClick={() => {navigate("/adicionar-contrato") }}>{item}</ListItem> :
                    <ListItem>{item}</ListItem>}
                    
                </React.Fragment>
            )
            })}
        </ListContainer>
    </>
  )
}

export default List;