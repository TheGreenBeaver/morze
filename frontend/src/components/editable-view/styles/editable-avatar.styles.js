import { makeStyles } from '@material-ui/core';


const useStyles = makeStyles(theme => ({
  avatarHint: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    borderRadius: '50%',
    pointerEvents: 'none',
    backgroundColor: theme.palette.grey[700],
    opacity: 0.5,
    zIndex: 20
  },
  avatar: {
    width: 100,
    height: 100
  },
  wrapper: {
    marginBottom: theme.spacing(1),

    '& .MuiSvgIcon-root': {
      fontSize: 50
    }
  },
  removeBtn: {
    position: 'absolute',
    right: -theme.spacing(1),
    bottom: 0,
    padding: 0,

    '& .MuiSvgIcon-root': {
      fontSize: theme.typography.htmlFontSize + 2
    }
  }
}));

export default useStyles;