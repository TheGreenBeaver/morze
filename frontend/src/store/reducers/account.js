import { account } from '../actions/action-types';


const initialState = {
  userData: null
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case account.SET_USER_DATA:
      return { ...state, userData: action.userData };
    case account.LOG_OUT:
      return initialState;
    case account.SET_VERIFIED:
      return state.userData
        ? { ...state, userData: { ...state.userData, isVerified: action.isVerified } }
        : state;
    default:
      return state;
  }
}

export default reducer;