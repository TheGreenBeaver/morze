import { account, general } from '../actions/action-types';


const initialState = {
  error: null,
  modalStack: [],
  sidebarOpen: false
};


const reducer = (state = initialState, action) => {
  switch (action.type) {
    case general.SET_ERROR:
      return { ...state, error: action.error };
    case general.PUSH_MODAL:
      return { ...state, modalStack: [...state.modalStack, action.modalContent] };
    case general.CLOSE_MODAL:
      return { ...state, modalStack: state.modalStack.slice(0, -1) }
    case account.LOG_OUT:
      return { ...state, modalStack: [] };
    case general.SET_SIDEBAR_OPEN:
      return { ...state, sidebarOpen: action.open };
    default:
      return state;
  }
};

export default reducer;