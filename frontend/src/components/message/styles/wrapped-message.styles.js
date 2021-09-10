import { makeStyles } from '@material-ui/core';
import { teal } from '@material-ui/core/colors';


const useStyles = makeStyles(theme => ({
  oneMessageWrapper: {
    width: '100%',
    maxWidth: 600,
    borderRadius: theme.shape.borderRadius,
    border: '2px solid',
    borderColor: 'transparent',
    cursor: 'pointer',

    '&:hover': {
      borderColor: teal[50]
    }
  },
  oneMessageWrapperSelected: {
    background: teal[50]
  },
}));

export default useStyles;