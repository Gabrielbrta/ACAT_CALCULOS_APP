import React from 'react'
import styled from 'styled-components';
import Menu from './Menu';
import Form from './Form';
import Contract from './Contract';

const Main = styled.main`
    width: 100%;
    height: 100vh;
    display:grid;
    grid-template-columns: 200px 1fr 260px;
`

const Home = () => {
  return (
    <Main>
        <Menu />
        <Contract />
        <Form />
    </Main>
  )
}

export default Home