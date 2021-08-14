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
    variantInfo: getConfig('secondary'),
    variantWarning: getConfig('warning'),
  };
});

export default useStyles;