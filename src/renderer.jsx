import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import {theme} from './styles/theme';
import { createRoot } from 'react-dom/client';
import Reset from './styles/reset';
import Home from './components/Home';
import Simulador from './components/Simulador';

const App = () => {
    return (
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <Reset />
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/simulador' element={<Simulador />} />
                </Routes>
            </ThemeProvider>
        </BrowserRouter>
    );
}

const container = document.getElementById('root')
const root = createRoot(container);
root.render(<App />);