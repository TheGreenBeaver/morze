import { makeStyles } from '@material-ui/core';
import { matchToolbar } from '../../../util/misc';
import { teal } from '@material-ui/core/colors';


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
  chatHeaderWrapper: {
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px ${theme.spacing(1)}px ${theme.spacing(3)}px`,
    borderBottom: `1px solid ${theme.palette.divider}`,
    zIndex: 10,
    background: theme.palette.background.paper,
    ...matchToolbar(theme, 'height', v => v * 0.9),
  },
  dragIndicator: {
    color: theme.palette.grey[400],
    '&:hover': {
      color: theme.palette.secondary.light
    }
  },

  messagesWrapper: {
    ...matchToolbar(theme, 'paddingTop', v => v * 0.9 + theme.spacing(2)),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingBottom: theme.spacing(1)
  },

  mentionedMessagesDisplay: {
    
  }
}));

export default useStyles;