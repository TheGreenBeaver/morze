import { makeStyles } from '@material-ui/core';


const useStyles = makeStyles(theme => ({
  baseAmber: {
    backgroundColor: theme.palette.primary.light
  },
  baseWhite: {
    backgroundColor: '#ffffff'
  },
  expandable: {
    transition: theme.transitions.create('width'),
    width: 56,

    '&:focus': {
      width: 240
    }
  }
}));

export default useStyles;