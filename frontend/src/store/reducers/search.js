import { search } from '../actions/action-types';


const initialState = {
  results: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case search.SET_SEARCH_RESULTS:
      return { ...state, results: action.results };
    default:
      return state;
  }
};

export default reducer;