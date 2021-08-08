import { combineReducers } from 'redux';
import account from './account';
import general from './general';


export const rootReducer = combineReducers({
  account,
  general
});
