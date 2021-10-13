import { makeStyles } from '@material-ui/core';


const useStyles = makeStyles(theme => ({
  playCircle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translateX(-50%) translateY(-50%)',
    opacity: 0.7,
    color: theme.palette.grey[200],

    '&:hover': {
      color: theme.palette.grey[50]
    }
  },
  durationChip: {
    position: 'absolute',
    right: theme.spacing(1),
    bottom: theme.spacing(1),
    opacity: 0.7,
    height: '1.4rem',
    width: 'fit-content',
    maxHeight: '1.4rem',
    borderRadius: '0.5rem',

    '& .MuiChip-label': {
      padding: theme.spacing(0, 1, 0, 1)
    }
  },
  bgFiller: {
    background: theme.palette.grey[700]
  },
  infoBar: {
    height: '30%',
    maxHeight: 68,
    minHeight: 28
  },
  infoBarTiny: {
    '& .MuiImageListItemBar-title': {
      fontSize: '0.75rem',
      lineHeight: '0.8rem'
    },
    '& .MuiImageListItemBar-subtitle': {
      fontSize: '0.55rem',
      lineHeight: '0.6rem'
    }
  }
}));

export default useStyles;