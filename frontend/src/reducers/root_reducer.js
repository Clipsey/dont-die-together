import { combineReducers } from 'redux';
import session from './session_api_reducer';
import errors from './error_reducer';
import tweets from './tweets_reducer';
import ui from './ui_reducer';
import users from './user_reducer';

const RootReducer = combineReducers({
  users,
  session,
  errors,
  tweets,
  ui,
});

export default RootReducer;