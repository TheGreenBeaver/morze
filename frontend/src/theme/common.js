import { makeStyles } from '@material-ui/core';


const useCommonStyles = makeStyles(theme => ({
  hiddenInput: {
    display: 'none'
  },
  pointer: {
    cursor: 'pointer'
  },
  centerVertical: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  pureLinkBtn: {
    padding: 0,
    textTransform: 'none',
    background: 'none !important',
  },
  dummyBackdrop: {
    pointerEvents: 'none',

    '& .MuiPaper-root': {
      pointerEvents: 'auto'
    }
  },
  verticalDistribution: {
    marginBottom: theme.spacing(1),

    '&:last-child': {
      marginBottom: 0
    }
  },
  externalLink: {
    color: theme.palette.secondary.main,
    textDecoration: 'none',

    '&:hover': {
      textDecoration: 'none',
      color: theme.palette.secondary.dark
    }
  },
  inputAreaHorizontalAlign: {
    maxWidth: 700,
    width: `calc(100% - ${theme.spacing(4) * 2}px)`,
    margin: '0 auto',
  },
  ellipsis: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  }
}));

export default useCommonStyles;