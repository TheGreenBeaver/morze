import { makeStyles } from '@material-ui/core';


const useStyles = makeStyles(theme => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1)
  },
  modalPaperRoot: {
    minWidth: 480,
    minHeight: 320,
    [theme.breakpoints.down('sm')]: {
      minWidth: 0,
      width: '70vw'
    }
  },
  placeholder: {
    minHeight: 32
  }
}));

export default useStyles;