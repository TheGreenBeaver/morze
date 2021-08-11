import { combineReducers } from 'redux';
import account from './account';
import general from './general';
import chats from './chats';


export const rootReducer = combineReducers({
  account,
  general,
  chats
});
