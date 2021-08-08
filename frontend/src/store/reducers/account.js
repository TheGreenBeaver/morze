import { clearCredentials, getIsAuthorized, saveCredentials } from '../../util/auth';
import { account } from '../actions/action-types';


const initialState = {
  isAuthorized: getIsAuthorized(),
  userData: null
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case account.SIGN_IN:
      saveCredentials(action.token);
      return { ...state, isAuthorized: true };
    case account.SET_USER_DATA:
      return { ...state, userData: action.userData };
    case account.LOG_OUT:
      clearCredentials();
      return { ...state, isAuthorized: false, userData: null };
    case account.SET_VERIFIED:
      return state.isAuthorized
        ? { ...state, userData: { ...state.userData, isVerified: action.isVerified } }
        : state;
    default:
      return state;
  }
}

export default reducer;