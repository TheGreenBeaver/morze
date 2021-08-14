import { makeStyles } from '@material-ui/core';


const useStyles = makeStyles(theme => ({
  root: {
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(1)}px ${theme.spacing(3)}px`,
    width: 450
  },
  box: {
    padding: theme.spacing(3)
  },
  logo: {
    height: 100,
    backgroundSize: 'contain'
  },
}));

export default useStyles;