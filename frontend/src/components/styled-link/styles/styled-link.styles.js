import { makeStyles } from '@material-ui/core';


const useStyles = makeStyles(theme => ({
  root: {
    color: theme.palette.secondary.main,
    '&:hover': {
      textDecoration: 'none',
      color: theme.palette.secondary.light
    }
  }
}));

export default useStyles;