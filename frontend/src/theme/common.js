import { makeStyles } from '@material-ui/core';


const useCommonStyles = makeStyles(() => ({
  hiddenInput: {
    display: 'none'
  },
  centerVertical: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
}));

export default useCommonStyles;