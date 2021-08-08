import { makeStyles } from '@material-ui/core';


const useFormStyles = makeStyles(theme => ({
  submitBtn: {
    marginTop: theme.spacing(2)
  },
  redirect: {
    marginTop: theme.spacing(1),
    display: 'block'
  }
}));

export default useFormStyles;