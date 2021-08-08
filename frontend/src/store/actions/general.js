import { general } from './action-types';


const setError = error => ({
  type: general.SET_ERROR,
  error,
});

const clearError = () => setError(null);

export {
  setError,
  clearError
};