import { makeStyles } from '@material-ui/core';
import { matchToolbar } from '../../../util/misc';


const useStyles = makeStyles(theme => ({
  content: matchToolbar(theme, 'paddingTop')
}));

export default useStyles;