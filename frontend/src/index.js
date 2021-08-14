import React from 'react';
import ReactDOM from 'react-dom';
import ScopedCssBaseline from '@material-ui/core/ScopedCssBaseline';
import App from './App';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { store } from './store';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './theme';
import AlertSystem from './components/alert-system';
import { CookiesProvider } from 'react-cookie';
import WsContext from './contexts/ws-context';
import Container from '@material-ui/core/Container';
import './theme/reset.css';
import AxiosContext from './contexts/axios-context';
import MainModal from './components/modals';


ReactDOM.render(
  <React.StrictMode>
    {/* --- UI (Theme, CSS Reset, Snackbars) --- */}
    <ThemeProvider theme={theme}>
      <ScopedCssBaseline>
        <AlertSystem>
          {/* --- Cookies (Auth) --- */}
          <CookiesProvider>
            {/* --- Redux --- */}
            <Provider store={store}>
              {/* --- Routing --- */}
              <Router>
                {/* --- API (axios HTTP + WebSockets) --- */}
                <WsContext>
                  <AxiosContext>
                    {/* --- Layout Wrapper --- */}
                    <MainModal />
                    <Container>
                      <App />
                    </Container>
                  </AxiosContext>
                </WsContext>
              </Router>
            </Provider>
          </CookiesProvider>
        </AlertSystem>
      </ScopedCssBaseline>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
