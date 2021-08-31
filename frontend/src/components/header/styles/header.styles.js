import { makeStyles } from '@material-ui/core';
import { matchToolbar } from '../../../util/misc';


const useStyles = makeStyles(theme => ({
  logo: matchToolbar(theme, 'height', v => 0.8 * v),
  toolbar: {
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'center'
    }
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  avatar: {
    ...matchToolbar(theme, ['height', 'width'], v => 0.6 * v),
    marginLeft: theme.spacing(3),
    cursor: 'pointer'
  },
  rightBlock: {
    paddingRight: theme.spacing(3)
  },
  sidebarButton: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    left: theme.spacing(2)
  }
}));

export default useStyles;