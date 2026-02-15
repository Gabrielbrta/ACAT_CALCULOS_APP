import React from 'react'
import styled from 'styled-components';
import Menu from './Menu';
import Contract from './Contract';

const Main = styled.main`
    width: 100%;
    height: 100vh;
    display:grid;
    grid-template-columns: 280px 1fr;
`

const Home = () => {
  return (
    <Main>
        <Menu />
        <Contract />
    </Main>
  )
}

export default Home;