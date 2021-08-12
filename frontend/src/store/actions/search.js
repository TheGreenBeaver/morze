import { search } from './action-types';


const setSearchResults = results => ({
  type: search.SET_SEARCH_RESULTS,
  results
});

export {
  setSearchResults
};