import { account } from './action-types';


const signInAction = token => ({
  type: account.SIGN_IN,
  token
});

const logOutAction = () => ({
  type: account.LOG_OUT
});

const setVerified = isVerified => ({
  type: account.SET_VERIFIED,
  isVerified
});

const setUserData = userData => ({
  type: account.SET_USER_DATA,
  userData
});

export {
  signInAction,
  logOutAction,
  setVerified,
  setUserData
};