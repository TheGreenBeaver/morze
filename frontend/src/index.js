import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { store } from './store';
import ScopedCssBaseline from '@material-ui/core/ScopedCssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './theme';
import AlertSystem from './components/alert-system';
import { CookiesProvider } from 'react-cookie';
import WsContext from './contexts/ws-context';
import Container from '@material-ui/core/Container';
import './theme/reset.css';


ReactDOM.render(
  <React.StrictMode>
    <CookiesProvider>
      <ThemeProvider theme={theme}>
        <ScopedCssBaseline>
          <AlertSystem>
            <Provider store={store}>
              <Router>
                <WsContext>
                  <Container>
                    <App />
                  </Container>
                </WsContext>
              </Router>
            </Provider>
          </AlertSystem>
        </ScopedCssBaseline>
      </ThemeProvider>
    </CookiesProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
