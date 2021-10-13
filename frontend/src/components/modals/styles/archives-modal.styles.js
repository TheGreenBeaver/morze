import { makeStyles } from '@material-ui/core';


const useStyles = makeStyles(theme => ({
  dialogContent: {
    paddingTop: 0,
    width: '80vw',
    height: '60vh',
    maxWidth: '100%',
    boxSizing: 'border-box'
  },
  oneTab: {
    minWidth: 'unset !important',
    paddingTop: theme.spacing(1.5),

    [theme.breakpoints.down('xs')]: {
      fontSize: '0.8rem'
    }
  },
  tabsRoot: {
    minHeight: 'unset !important',
    borderBottom: `1px solid ${theme.palette.divider}`,

    '& *': {
      minHeight: 'unset !important'
    }
  },
  tabPanel: {
    padding: theme.spacing(2, 0, 0, 0)
  },
  navBtn: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    color: theme.palette.grey[200],
    opacity: 0.8,

    '& .MuiSvgIcon-root': {
      fontSize: '3.2rem'
    },

    '&:hover': {
      color: theme.palette.secondary.light
    }
  },
  nextBtn: {
    right: theme.spacing(1)
  },
  prevBtn: {
    left: theme.spacing(1)
  },
  backBtn: {
    background: 'none !important',
    border: 'none !important',
    color: theme.palette.secondary.main,
    boxShadow: 'none !important',
    marginTop: theme.spacing(1)
  }
}));

export default useStyles;