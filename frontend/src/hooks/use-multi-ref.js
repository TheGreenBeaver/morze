import { useRef } from 'react';
import { cloneDeep } from 'lodash';


function useMultiRef(amount, initial = null) {
  const refs = useRef([...Array(amount)].map(() => cloneDeep(initial)));

  function getRef(idx) {
    return obj => {
      refs.current[idx] = obj;
    };
  }

  return { refs, getRef };
}

export default useMultiRef;