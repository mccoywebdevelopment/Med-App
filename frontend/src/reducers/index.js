import { combineReducers } from 'redux';
import auth from './auth';
import message from './messages';
import loading from './loading';


export default combineReducers({
  auth,
  message,
  loading
});
