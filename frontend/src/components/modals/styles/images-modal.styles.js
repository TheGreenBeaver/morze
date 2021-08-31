import { makeStyles } from '@material-ui/core';


const useStyles = makeStyles(theme => ({
  allImagesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, 100px)',
    width: '100%',
    columnGap: theme.spacing(1),
    rowGap: theme.spacing(2),
  },
  horizontal: {
    width: '100%',
    height: 'auto'
  },
  vertical: {
    width: 'auto',
    height: '100%',
  },
  navBtn: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    opacity: 0.7
  },
  btnBack: {
    left: theme.spacing(1)
  },
  btnNext: {
    right: theme.spacing(1)
  }
}));

export default useStyles;