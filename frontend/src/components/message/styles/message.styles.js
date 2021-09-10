import { makeStyles } from '@material-ui/core';
import { teal } from '@material-ui/core/colors';
import { ONE_IMAGE_WRAPPER } from '../../../util/constants';


const useStyles = makeStyles(theme => ({
  message: {
    display: 'flex',
    alignItems: 'stretch',
    background: 'transparent',
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
    maxWidth: 600,
    width: '100%',
    boxSizing: 'border-box',
  },
  mentionedMessage: {
    borderLeft: `2px solid ${teal[100]}`,
    width: '90%',
    maxWidth: 500,
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
  messageHeaderBlock: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1) / 2,

    '& div': {
      display: 'flex',

      '& .MuiIconButton-root': {
        padding: 0,

        '& .MuiSvgIcon-root': {
          height: theme.typography.htmlFontSize,
          width: theme.typography.htmlFontSize,
        }
      }
    }
  },
  name: {
    marginRight: theme.spacing(1)
  },
  deleteButton: {
    marginRight: theme.spacing(1)
  },
  imageAttachment: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translateX(-50%) translateY(-50%)',
  },
  imageAttachmentHorizontal: {
    width: '100%',
    height: 'auto',
  },
  imageAttachmentVertical: {
    height: 'auto',
    width: 'auto',
    maxHeight: '30vw'
  },
  imgContainer: {
    width: '100%',
  },
  imgContainer_1img: {

    [`& .${ONE_IMAGE_WRAPPER}`]: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',

      '& > img': {
        position: 'static',
        transform: 'none',
      }
    },
  },
  imgContainer_2img: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',

    [`& .${ONE_IMAGE_WRAPPER}`]: {
      width: '50%',
      paddingTop: '50%',

      '&:first-child': {
        marginRight: theme.spacing(1)
      }
    },

    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',

      [`& .${ONE_IMAGE_WRAPPER}`]: {
        width: '100%',
        paddingTop: '100%',

        '&:first-child': {
          marginBottom: theme.spacing(1),
          marginRight: 0
        }
      },
    }
  },
  imgContainer_3img: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gridTemplateRows: '1fr 1fr',
    gridTemplateAreas: '"img-1 img-2" "img-1 img-3"',
    rowGap: theme.spacing(1),
    columnGap: theme.spacing(1),

    [`& .${ONE_IMAGE_WRAPPER}`]: {
      width: '100%',
      paddingTop: '100%',

      ...[...Array(3)].reduce((acc, _, idx) => ({
        ...acc,
        [`&:nth-child(${idx + 1})`]: {
          gridArea: `img-${idx + 1}`
        }
      }), {}),
    },

    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: '1fr 1fr',
      gridTemplateRows: '2fr 1fr',
      gridTemplateAreas: '"img-1 img-1" "img-2 img-3"',
    }
  },
  imgContainer_many: {
    display: 'flex',
    flexWrap: 'wrap',
    rowGap: theme.spacing(1),
    columnGap: theme.spacing(1),
    justifyContent: 'space-around',

    [`& .${ONE_IMAGE_WRAPPER}`]: {
      width: '40%',
      minWidth: 200,
      paddingTop: '40%',
      minHeight: 200
    }
  }
}));

export default useStyles;