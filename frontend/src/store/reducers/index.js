import { combineReducers } from 'redux';
import account from './account';
import general from './general';
import chats from './chats';
import search from './search';


export const rootReducer = combineReducers({
  account,
  general,
  chats,
  search
});
