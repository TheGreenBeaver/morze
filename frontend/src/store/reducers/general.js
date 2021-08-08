import { general } from '../actions/action-types';


const initialState = {
  error: null
};


const reducer = (state = initialState, action) => {
  switch (action.type) {
    case general.SET_ERROR:
      return { ...state, error: action.error };
    default:
      return state;
  }
};

export default reducer;