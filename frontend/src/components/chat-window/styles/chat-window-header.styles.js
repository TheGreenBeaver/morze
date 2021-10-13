import { makeStyles } from '@material-ui/core';
import { CHAT_WINDOW_HEADER_HEIGHT } from '../../../util/constants';


const LEFT_AREA = 'left-area';
const MIDDLE_AREA = 'middle-area';
const RIGHT_AREA = 'right-area';

const useStyles = makeStyles(theme => ({
  basic: {
    background: theme.palette.background.paper,
    borderBottom: `1px solid ${theme.palette.divider}`,
    display: 'grid',
    gridTemplateAreas: `"${LEFT_AREA} ${MIDDLE_AREA} ${RIGHT_AREA}"`,
    // Width of a Normal IconButton (including paddings)
    gridTemplateColumns: `45px 1fr 45px`,
    alignItems: 'center',
    width: '100%'
  },

  leftArea: {
    gridArea: LEFT_AREA
  },
  middleArea: {
    gridArea: MIDDLE_AREA
  },
  rightArea: {
    gridArea: RIGHT_AREA
  },

  heightS: {
    height: CHAT_WINDOW_HEADER_HEIGHT.s
  },
  heightML: {
    height: CHAT_WINDOW_HEADER_HEIGHT.ml
  },
  dragIndicatorSlot: {
    padding: theme.spacing(1)
  },
  dragIndicator: {
    color: theme.palette.grey[400],
    marginLeft: 12,
    transition: theme.transitions.create('color'),

    '&:hover': {
      color: theme.palette.secondary.light
    }
  },
  titlePane: {
    display: 'block',
    textAlign: 'center',
    width: '100%',
    height: '100%',
    paddingTop: theme.spacing(1),

    '& .MuiTypography-root': {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      lineHeight: 1
    }
  },
  chatInfoBtn: {
    color: theme.palette.grey[500],
    lineHeight: 1,
    transition: theme.transitions.create('color'),

    '&:hover': {
      color: theme.palette.grey[600]
    }
  },
  selectedMessagesMainPane: {
    '& .MuiTypography-root': {
      marginRight: theme.spacing(5)
    },
    '& .MuiButton-outlined': {
      marginLeft: theme.spacing(1)
    }
  }
}));

export default useStyles;