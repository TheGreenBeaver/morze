import { makeStyles } from '@material-ui/core';


const useStyles = makeStyles(theme => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    flex: 'auto'
  },
  content: {
    flex: 'auto'
  },
}));

export default useStyles;