import { combineReducers } from 'redux';
import session from './session_api_reducer';
import errors from './error_reducer';
import tweets from './tweets_reducer';

const RootReducer = combineReducers({
  session,
  errors,
  tweets
});

export default RootReducer;