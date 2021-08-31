import { makeStyles } from '@material-ui/core';


const useStyles = makeStyles(({ palette: p }) => {
  function getConfig(type) {
    const color = p.getContrastText(p[type].dark);
    return {
      backgroundColor: p[type].dark,
      color,

      '& .MuiSvgIcon-root': {
        color
      }
    };
  }

  return {
    variantSuccess: getConfig('success'),
    variantError: getConfig('error'),
    variantInfo: {
      backgroundColor: p.secondary.main,
      color: p.getContrastText(p.secondary.main),

      '& .MuiSvgIcon-root': {
        color: p.getContrastText(p.secondary.main)
      }
    },
    variantWarning: getConfig('warning'),
  };
});

export default useStyles;