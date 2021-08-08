import { createTheme } from '@material-ui/core/styles';


const theme = createTheme({
  palette: {
    primary: {
      main: '#ffcc00'
    },
    secondary: {
      main: '#009688'
    },
    success: {
      main: '#c0ca33'
    },
    error: {
      main: '#e91e63'
    },
    warning: {
      main: '#f57c00'
    }
  },

  typography: {
    fontFamily: '"Arial", sans-serif'
  },

  props: {
    MuiTextField: {
      fullWidth: true,
      margin: 'normal',
      variant: 'outlined'
    },
    MuiButton: {
      variant: 'contained'
    }
  },

  overrides: {
    MuiContainer: {
      root: {
        height: '100vh',
        minHeight: '100vh'
      }
    },
    MuiFormControl: {
      marginNormal: {
        '&:first-child': {
          marginTop: 0
        }
      }
    }
  }
});

export default theme;