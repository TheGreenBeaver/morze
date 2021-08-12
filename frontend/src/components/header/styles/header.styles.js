import { makeStyles } from '@material-ui/core';
import { matchToolbar } from '../../../util/misc';


const useStyles = makeStyles(theme => ({
  logo: matchToolbar(theme, 'height', 0.8),
  toolbar: {
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'center'
    }
  },
  avatar: {
    ...matchToolbar(theme, ['height', 'width'], 0.6),
    marginLeft: theme.spacing(3)
  },
  rightBlock: {
    paddingRight: theme.spacing(3)
  }
}));

export default useStyles;