import { useRef } from 'react';
import { isEqual } from 'lodash';


function useCachedFunction(f) {
  const cache = useRef([]);

  function callWCache(...args) {
    if (!isEqual(cache.current, [...args])) {
      f(...args);
      cache.current = [...args];
    }
  }

  return callWCache;
}

export default useCachedFunction;