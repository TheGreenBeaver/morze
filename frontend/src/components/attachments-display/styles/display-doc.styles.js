import { makeStyles } from '@material-ui/core';


const useStyles = makeStyles(theme => ({
  docLink: {
    color: theme.palette.secondary.main,
    textDecoration: 'none',
    display: 'flex',
    paddingTop: theme.spacing(1) / 2,

    '&:hover': {
      textDecoration: 'none',
      color: theme.palette.secondary.dark
    }
  },
  docLinkText: {
    maxWidth: 100,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    marginLeft: theme.typography.htmlFontSize,
  },
  removeBtn: {
    right: 'unset',
    left: theme.typography.htmlFontSize,
    top: 0
  }
}));

export default useStyles;