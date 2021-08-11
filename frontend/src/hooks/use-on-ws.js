import { useEffect } from 'react';
import { useSelector } from 'react-redux';


function useOnWs(toDo) {
  const { wsReady } = useSelector(state => state.general);

  useEffect(() => {
    if (wsReady) {
      toDo();
    }
  }, [wsReady])
}

export default useOnWs;