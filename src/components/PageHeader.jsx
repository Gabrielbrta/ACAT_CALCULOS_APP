import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const HeaderContainer = styled.div`
  margin-bottom: 24px;
`;

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 0.875rem;
  color: ${({theme}) => theme.color.textLight};
  
  a, span {
    color: ${({theme}) => theme.color.textLight};
    text-decoration: none;
    transition: color 0.2s ease;
    cursor: pointer;
    
    &:hover {
      color: ${({theme}) => theme.color.primary};
    }
  }
  
  .separator {
    color: ${({theme}) => theme.color.border};
    cursor: default;
    
    &:hover {
      color: ${({theme}) => theme.color.border};
    }
  }
  
  .current {
    color: ${({theme}) => theme.color.subtitle};
    cursor: default;
    font-weight: ${({theme}) => theme.font.wheightH3};
    
    &:hover {
      color: ${({theme}) => theme.color.subtitle};
    }
  }
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  color: ${({theme}) => theme.color.title};
  font-weight: ${({theme}) => theme.font.wheightBold};
  margin: 0;
`;

const PageHeader = ({ title, breadcrumbs }) => {
  const navigate = useNavigate();

  return (
    <HeaderContainer>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb>
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span className="separator">/</span>}
              {crumb.path ? (
                <span onClick={() => navigate(crumb.path)}>
                  {crumb.label}
                </span>
              ) : (
                <span className="current">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </Breadcrumb>
      )}
      <PageTitle>{title}</PageTitle>
    </HeaderContainer>
  );
};

export default PageHeader;
