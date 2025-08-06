import { ThemeProvider } from 'styled-components';
import Reset from './styles/reset';
import {theme} from './styles/theme';
import { createRoot } from 'react-dom/client';
import Home from './components/Home';

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <Reset />
            <Home />
        </ThemeProvider>
    );
}

const container = document.getElementById('root')
const root = createRoot(container);
root.render(<App />);