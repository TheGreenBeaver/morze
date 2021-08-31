import { account, general } from '../actions/action-types';


const initialState = {
  error: null,
  modalContent: null,
  sidebarOpen: false
};


const reducer = (state = initialState, action) => {
  switch (action.type) {
    case general.SET_ERROR:
      return { ...state, error: action.error };
    case general.SET_MODAL_CONTENT:
      return { ...state, modalContent: action.modalContent };
    case account.LOG_OUT:
      return { ...state, modalContent: null };
    case general.SET_SIDEBAR_OPEN:
      return { ...state, sidebarOpen: action.open };
    default:
      return state;
  }
};

export default reducer;