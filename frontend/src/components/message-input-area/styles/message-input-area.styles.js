import { makeStyles } from '@material-ui/core';


const useStyles = makeStyles(theme => ({
  inputWrapper: {
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px ${theme.spacing(2)}px ${theme.spacing(3)}px`,
    display: 'flex',
    alignItems: 'center',
    maxWidth: 800,
    width: '100%',
    margin: '0 auto',
  },
}));

export default useStyles;