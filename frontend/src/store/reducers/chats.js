import { chats } from '../actions/action-types';


const initialState = {
  chats: []
};


const reducer = (state = initialState, action) => {
  switch (action.type) {
    case chats.SET_CHATS:
      return { ...state, chats: action.chats };
    case chats.ADD_CHAT:
      return { ...state, chats: [action.newChat, ...state.chats] };
    default:
      return state;
  }
};

export default reducer;