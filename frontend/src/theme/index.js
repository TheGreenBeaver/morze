import { createTheme } from '@material-ui/core/styles';
import { grey, teal, lime, pink, orange } from '@material-ui/core/colors';


const theme = createTheme({
  palette: {
    primary: {
      main: '#ffcc00'
    },
    secondary: {
      main: teal[500],
      contrastText: '#fff'
    },
    success: {
      main: lime[600]
    },
    error: {
      main: pink[500]
    },
    warning: {
      main: orange[700]
    }
  },

  props: {
    MuiTextField: {
      fullWidth: true,
      margin: 'normal',
      variant: 'outlined',
      size: 'small'
    },
    MuiButton: {
      variant: 'contained'
    },
    MuiIconButton: {
      color: 'primary'
    },
    MuiDialogContent: {
      dividers: true
    },
    MuiListItem: {
      disableRipple: true
    }
  },

  overrides: {
    MuiScopedCssBaseline: {
      root: {
        minHeight: '100vh',
      }
    },
    MuiContainer: {
      maxWidthLg: {
        maxWidth: '1480px !important'
      }
    },
    MuiFormControl: {
      marginNormal: {
        '&:first-child': {
          marginTop: 0
        }
      }
    },
    MuiIconButton: {
      root: {
        background: 'none !important',
      },
      colorPrimary: {
        color: grey[600],
        transition: 'color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        '&:hover': {
          color: teal[500]
        }
      },
      colorSecondary: {
        color: grey[400],
        transition: 'color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        '&:hover': {
          color: teal[300]
        }
      }
    },
    MuiBadge: {
      anchorOriginTopRightRectangle: {
        transform: 'scale(1) translate(120%, -50%)'
      }
    },
    MuiListItem: {
      root: {
        '&:hover': {
          backgroundColor: `${teal[50]} !important`
        },
        '&.Mui-selected': {
          backgroundColor: `${teal[100]} !important`
        }
      }
    }
  }
});

export default theme;