import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import {theme} from './styles/theme';
import { createRoot } from 'react-dom/client';
import Reset from './styles/reset';
import Home from './components/Home';
import Simulador from './components/Simulador';
import ListaContratos from './components/ListaContratos';
import Form from './components/Form';
import { ContractProvider } from './contexts/ContractContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
    return (
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <ContractProvider>
                    <Reset />
                    <ToastContainer
                        position="top-right"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="light"
                    />
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/simulador' element={<Simulador />} />
                        <Route path='/contratos' element={<ListaContratos />} />
                        <Route path='/adicionar-contrato' element={<Form />} />
                        <Route path='/editar-contrato/:id' element={<Form />} />
                    </Routes>
                </ContractProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
}

const container = document.getElementById('root')
const root = createRoot(container);
root.render(<App />);