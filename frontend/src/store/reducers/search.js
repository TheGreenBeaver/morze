import { search } from '../actions/action-types';


const initialState = {
  results: [],
  isLoading: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case search.SET_SEARCH_RESULTS:
      return { ...state, results: action.results };
    case search.SET_SEARCH_IS_LOADING:
      return { ...state, isLoading: action.isLoading };
    default:
      return state;
  }
};

export default reducer;