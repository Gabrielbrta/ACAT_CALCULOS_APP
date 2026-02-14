import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import {theme} from './styles/theme';
import { createRoot } from 'react-dom/client';
import Reset from './styles/reset';
import Home from './components/Home';
import Simulador from './components/Simulador';
import { ContractProvider } from './contexts/ContractContext';

const App = () => {
    return (
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <ContractProvider>
                    <Reset />
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/simulador' element={<Simulador />} />
                    </Routes>
                </ContractProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
}

const container = document.getElementById('root')
const root = createRoot(container);
root.render(<App />);