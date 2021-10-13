import { makeStyles } from '@material-ui/core';


const useStyles = makeStyles(theme => ({
  typeSelectButton: {
    textDecoration: 'underline',
    cursor: 'pointer',
    marginLeft: theme.spacing(1) / 2,
    display: 'flex',
    alignItems: 'center',

    '& .MuiSvgIcon-root': {
      fontSize: '1rem'
    },

    '&:hover': {
      color: theme.palette.secondary.light
    }
  },
  wrapper: {
    padding: theme.spacing(2)
  },
  textField: {
    marginTop: theme.spacing(1) / 2
  }
}));

export default useStyles;