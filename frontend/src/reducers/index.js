import { combineReducers } from 'redux';
import auth from './auth';
import message from './messages';
import loading from './loading';
import popUp from './popUp';
import groups from './groups';
import dependents from './dependents';


export default combineReducers({
  auth,
  message,
  loading,
  popUp,
  groups,
  dependents
});
