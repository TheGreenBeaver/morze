import { useMediaQuery, useTheme } from '@material-ui/core';


function useScreenIsSmall() {
  const { breakpoints } = useTheme();
  return useMediaQuery(breakpoints.down('xs'));
}

export default useScreenIsSmall;