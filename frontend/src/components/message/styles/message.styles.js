import { makeStyles } from '@material-ui/core';
import { teal } from '@material-ui/core/colors';


const useStyles = makeStyles(theme => ({
  message: {
    display: 'flex',
    alignItems: 'stretch',
    background: 'transparent',
    paddingRight: theme.spacing(7),
    paddingTop: theme.spacing(1),
    maxWidth: 600,
    width: '100%',
    boxSizing: 'border-box'
  },
  wideBodyMessage: {
    paddingRight: theme.spacing(2),
  },
  mentionedMessage: {
    borderLeft: `2px solid ${teal[100]}`,
    width: '90%',
    alignSelf: 'flex-end',

    '&:last-child': {
      marginBottom: theme.spacing(1)
    }
  },
  avatarColumn: {
    width: 40 + theme.spacing(2) * 2,
    padding: theme.spacing(1, 2),
    paddingTop: 0
  },
  messageBodyColumn: {
    width: `calc(100% - ${40 + theme.spacing(2) * 2}px)`
  },
  messageHeaderBlock: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: theme.spacing(1) / 2,

    '& div': {
      display: 'flex',

      '& .MuiTypography-root': {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
      },

      '& .MuiIconButton-root': {
        padding: 0,

        '& .MuiSvgIcon-root': {
          height: theme.typography.htmlFontSize,
          width: theme.typography.htmlFontSize,
        }
      }
    }
  },
  leftGap: {
    marginLeft: theme.spacing(1)
  },
  messageText: {
    wordBreak: 'break-all'
  },
  messageOptionItem: {
    padding: theme.spacing(0.5, 1),

    '& *': {
      fontSize: '1rem',
      lineHeight: 1
    }
  }
}));

export default useStyles;