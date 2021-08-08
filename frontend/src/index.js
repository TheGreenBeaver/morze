import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { store } from './store';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './theme';
import Container from '@material-ui/core/Container';
import AlertSystem from './components/alert-system';


ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <ThemeProvider theme={theme}>
      <AlertSystem>
        <Container>
          <Provider store={store}>
            <Router>
              <App />
            </Router>
          </Provider>
        </Container>
      </AlertSystem>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
