import { useEffect, useRef } from 'react';
import { debounce } from 'lodash';
import { useAxios } from '../contexts/axios-context';


function useDebouncedApiCall(endpointConfig, deps, {
  beforeAny = () => {},
  extraCondition = () => true,
  onSuccess = () => {},
  onError = () => {},
  onAny = () => {} } = {}
) {
  const apiRef = useRef(null);
  const debouncedFunc = useRef(debounce(
    (currentApi, ...currentDeps) => {
      beforeAny(...currentDeps);
      currentApi.call().then(onSuccess).catch(onError).finally(onAny);
    },
    800
  ));
  const { api } = useAxios();

  const consistentDeps = JSON.stringify(deps);
  useEffect(() => {
    debouncedFunc.current?.cancel?.();
    apiRef.current?.cancel?.();

    if (extraCondition(...deps)) {
      const newApi = api(endpointConfig, ...deps);
      apiRef.current = newApi;
      debouncedFunc.current(newApi, ...deps);
    }
  }, [consistentDeps]);
}

export default useDebouncedApiCall;