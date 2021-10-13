import { makeStyles } from '@material-ui/core';


const useStyles = makeStyles(theme => ({
  avatar: {
    width: theme.typography.fontSize * 1.5,
    minWidth: theme.typography.fontSize * 1.5,
    height: theme.typography.fontSize * 1.5,
    minHeight: theme.typography.fontSize * 1.5,
    marginRight: theme.spacing(1)
  },
  wrapper: {
    cursor: 'pointer',
    padding: theme.spacing(0, 1)
  }
}));

export default useStyles;