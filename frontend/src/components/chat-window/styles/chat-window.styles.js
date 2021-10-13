import { makeStyles } from '@material-ui/core';
import { matchToolbar } from '../../../util/misc';


const useStyles = makeStyles(theme => ({
  slot: {
    minHeight: 250,
    borderRadius: theme.shape.borderRadius,
    border: '2px solid',
    borderColor: theme.palette.divider,
    backgroundColor: theme.palette.background.paper
  },
  draggedItemOverlay: {
    opacity: 0.6,
    backgroundColor: theme.palette.grey[800],
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 20
  },

  messagesWrapper: {
    padding: theme.spacing(3, 3, 1, 3),
  }
}));

export default useStyles;