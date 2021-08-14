import { search } from './action-types';


const setSearchResults = results => ({
  type: search.SET_SEARCH_RESULTS,
  results
});

const setSearchIsLoading = isLoading => ({
  type: search.SET_SEARCH_IS_LOADING,
  isLoading
});

export {
  setSearchResults,
  setSearchIsLoading
};