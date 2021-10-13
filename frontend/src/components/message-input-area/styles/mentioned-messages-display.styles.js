import { makeStyles } from '@material-ui/core';


const useStyles = makeStyles(theme => ({
  removeBtn: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    right: theme.spacing(1) / 2,
    padding: 0,

    '& .MuiSvgIcon-root': {
      width: theme.typography.htmlFontSize,
      height: theme.typography.htmlFontSize,
    }
  },
  forwardedHeader: {
    position: 'relative'
  },
  forwardedText: {
    marginTop: theme.spacing(0.5)
  },
  smallAvatar: {
    width: '0.9rem',
    height: '0.9rem',
    minWidth: '0.9rem',
    minHeight: '0.9rem',
    marginRight: theme.spacing(0.5)
  }
}));

export default useStyles;