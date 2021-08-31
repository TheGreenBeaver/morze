import { makeStyles } from '@material-ui/core';


const useStyles = makeStyles(theme => ({
  logOutBtn: {
    marginLeft: `${theme.spacing(3)}px !important`
  },
  username: {
    marginTop: theme.spacing(1),
    paddingLeft: theme.typography.htmlFontSize
  }
}));

export default useStyles;