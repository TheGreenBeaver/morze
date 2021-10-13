import { makeStyles } from '@material-ui/core';


const useStyles = makeStyles(theme => ({
  wrapper: {
    top: '50%',
    transform: 'translateY(-50%)'
  },
  expandable: {
    transition: theme.transitions.create(['width', 'visibility']),
  },
  collapsed: {
    width: 0,
    visibility: 'hidden'
  },
  expanded: {
    width: 280
  },
  typeSelect: {
    width: '100%',

    '&:hover .MuiSvgIcon-root': {
      transition: theme.transitions.create(['color']),
      color: theme.palette.grey[500]
    },

    '& *': {
      border: 'none !important'
    },

    '& .MuiSelect-root': {
      display: 'flex',
      alignItems: 'center',
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: theme.spacing(2),

      '& .MuiSvgIcon-root': {
        fontSize: '2rem'
      }
    }
  },
  typeSelectWrapper: {
    minWidth: '20%',
    marginLeft: theme.spacing(2),

    '& .MuiSelect-root': {
      background: 'none !important'
    }
  },
  textField: {
    background: theme.palette.primary.light
  },
  textFieldFocused: {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: `${theme.palette.primary.contrastText} !important`
    }
  },
  toggleButton: {
    transition: theme.transitions.create(['color']),
    color: theme.palette.primary.contrastText,

    '&:hover': {
      color: theme.palette.grey[500]
    }
  },
  resultsPaper: {
    width: 280 * 0.8,
    left: '0 !important',
    maxHeight: '200px !important'
  }
}));

export default useStyles;