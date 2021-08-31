import { makeStyles } from '@material-ui/core';
import { matchToolbar } from '../../../util/misc';
import { SIDEBAR_OFFSET_CLASS, SIDEBAR_WIDTH } from '../../../util/constants';


const useStyles = makeStyles(theme => ({
  chatWindowsWrapper: {
    ...matchToolbar(theme, 'height', v => `calc(100vh - ${v}px)`),
    paddingTop: theme.spacing(3),
    paddingRight: theme.spacing(1),
    paddingBottom: theme.spacing(5),
    paddingLeft: theme.spacing(1),
    rowGap: theme.spacing(1),
    columnGap: theme.spacing(1),

    [`&.${SIDEBAR_OFFSET_CLASS}`]: {
      paddingLeft: SIDEBAR_WIDTH
    }
  },
  drawerPaper: {
    ...matchToolbar(theme, 'paddingTop', v => v + theme.spacing(1)),
    width: SIDEBAR_WIDTH
  },
  drawer: {
    width: SIDEBAR_WIDTH
  },
  dropOnEmptyIndicator: {
    position: 'absolute',
    top: theme.spacing(3),
    bottom: theme.spacing(5),
    right: theme.spacing(1),
    left: theme.spacing(1),
    background: 'transparent',
    borderRadius: theme.shape.borderRadius,

    [`&.${SIDEBAR_OFFSET_CLASS}`]: {
      left: SIDEBAR_WIDTH
    }
  },
  addChatBtn: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translateX(-50%) translateY(-50%)',
    zIndex: 20
  },
  addChatBtnPulse: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    backgroundColor: `${theme.palette.primary.light} !important`
  },
  chatItem: {
    display: 'block !important',

    '& .MuiTypography-root': {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
  },
  itemText: {
    width: '80%'
  }
}));

export default useStyles;