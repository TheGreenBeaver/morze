import { useMediaQuery, useTheme } from '@material-ui/core';


function useScreenIsSmall(breakpoint = 'sm') {
  const { breakpoints } = useTheme();
  return useMediaQuery(breakpoints.down(breakpoint));
}

export default useScreenIsSmall;