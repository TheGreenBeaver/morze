import { makeStyles } from '@material-ui/core';


const useStyles = makeStyles(theme => ({
  docLink: {
    display: 'flex',
    alignItems: 'flex-end',
    width: '100%'
  },
  docLinkText: {
    maxWidth: 100,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    lineHeight: 1.5,
    marginLeft: theme.spacing(1),
  },
  removeBtn: {
    right: 'unset',
    left: theme.typography.htmlFontSize,
    top: 0
  },
  linkWrapper: {
    height: 'calc(1.5rem + 8px)', // icon height + overlap
    minHeight: 'calc(1.5rem + 8px)'
  }
}));

export default useStyles;