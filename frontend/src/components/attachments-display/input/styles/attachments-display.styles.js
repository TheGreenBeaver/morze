import { makeStyles } from '@material-ui/core';


const FOR_SCROLLBAR = 7;

const useStyles = makeStyles(theme => ({
  removeBtn: {
    position: 'absolute',
    top: theme.spacing(1) / 2,
    right: theme.spacing(1) / 2,
    padding: 0,

    '& .MuiSvgIcon-root': {
      width: theme.typography.htmlFontSize,
      height: theme.typography.htmlFontSize,
    }
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'center',
    overflowX: 'auto',
    overflowY: 'hidden',
    columnGap: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  imgHeight: {
    height: 75 + FOR_SCROLLBAR,
    minHeight: 75 + FOR_SCROLLBAR
  },
  docHeight: {
    height: `calc(1.5rem + 8px + 24px + ${FOR_SCROLLBAR}px)`, // icon height + overlap + spacing + for scrollbar
    minHeight: `calc(1.5rem + 8px + 24px + ${FOR_SCROLLBAR}px)`
  },
  youtubeHeight: {
    height: 90 + FOR_SCROLLBAR,
    minHeight: 90 + FOR_SCROLLBAR
  },
  space: {
    height: theme.spacing(1),
    minHeight: theme.spacing(1),
    width: '100%'
  }
}));

export default useStyles;