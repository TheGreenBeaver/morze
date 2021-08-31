import { makeStyles } from '@material-ui/core';


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
    flexWrap: 'wrap',
    alignItems: 'center',
    maxWidth: 700,
    width: '100%',
    margin: '0 auto',
    rowGap: theme.spacing(1) / 2,
    columnGap: theme.spacing(1) / 2,
    marginBottom: theme.spacing(1)
  },
  space: {
    height: theme.spacing(1),
    minHeight: theme.spacing(1),
    width: '100%'
  }
}));

export default useStyles;