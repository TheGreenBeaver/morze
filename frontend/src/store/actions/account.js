import { account } from './action-types';


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
  logOutAction,
  setVerified,
  setUserData
};