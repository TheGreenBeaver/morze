import { general } from '../actions/action-types';


const initialState = {
  error: null,
  wsReady: false
};


const reducer = (state = initialState, action) => {
  switch (action.type) {
    case general.SET_ERROR:
      return { ...state, error: action.error };
    case general.SET_WS_READY:
      return { ...state, wsReady: action.isReady };
    default:
      return state;
  }
};

export default reducer;