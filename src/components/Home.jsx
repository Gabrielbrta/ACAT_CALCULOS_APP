import React from 'react'
import styled from 'styled-components';
import Menu from './Menu';
import Form from './Form';
import Contract from './Contract';

const Main = styled.main`
    width: 100%;
    height: 100vh;
    display:grid;
    grid-template-columns: 280px 1fr 300px;
`

const Home = () => {
  const [contratos , setContratos] = React.useState([]);
  const [cardContent, setCardContent] = React.useState("");

    React.useEffect(() => {
      window.Api.PegarContratos().then(contratos => setContratos(contratos));
    },[]); 

  return (
    <Main>
        <Menu contratos={contratos} setCardContent={setCardContent}/>
        <Contract idContrato={cardContent} setCardContent={setCardContent} />
        <Form setContratos={setContratos}/>
    </Main>
  )
}

export default Home;