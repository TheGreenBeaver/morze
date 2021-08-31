import { makeStyles } from '@material-ui/core';


const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2, 3, 1, 3),
    width: 450
  },
  box: {
    padding: theme.spacing(3)
  },
  logo: {
    height: 100,
    backgroundSize: 'contain !important'
  },
}));

export default useStyles;