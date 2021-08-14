import { useLocation } from 'react-router-dom';


function useClearPath() {
  const { pathname } = useLocation();
  return pathname.replace(/\/$/, '');
}

export default useClearPath;