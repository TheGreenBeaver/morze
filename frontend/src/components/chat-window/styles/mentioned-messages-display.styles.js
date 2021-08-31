import { makeStyles } from '@material-ui/core';
import { teal } from '@material-ui/core/colors';


const useStyles = makeStyles(theme => ({
  wrapper: {
    maxWidth: 700,
    width: '100%',
    borderLeft: `2px solid ${teal[100]}`,
    paddingLeft: theme.spacing(1),
    position: 'relative',
    margin: `0 auto ${theme.spacing(1)}px auto`
  },
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
  }
}));

export default useStyles;