import { makeStyles } from '@material-ui/core';


const useDragStyles = makeStyles(theme => ({
  dragTarget: {
    borderColor: theme.palette.primary.light,
    boxShadow: `0 0 10px ${theme.palette.primary.dark}`
  },
  cursorMove: {
    cursor: 'move'
  }
}));

export default useDragStyles;