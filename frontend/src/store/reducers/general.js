import { account, general } from '../actions/action-types';


const initialState = {
  error: null,
  modalContent: null
};


const reducer = (state = initialState, action) => {
  switch (action.type) {
    case general.SET_ERROR:
      return { ...state, error: action.error };
    case general.SET_MODAL_CONTENT:
      return { ...state, modalContent: action.modalContent };
    case account.LOG_OUT:
      return { ...state, modalContent: null };
    default:
      return state;
  }
};

export default reducer;