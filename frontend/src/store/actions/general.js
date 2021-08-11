import { general } from './action-types';


const setError = error => ({
  type: general.SET_ERROR,
  error,
});

const clearError = () => setError(null);

const setWsReady = isReady => ({
  type: general.SET_WS_READY,
  isReady
})

export {
  setError,
  clearError,
  setWsReady
};