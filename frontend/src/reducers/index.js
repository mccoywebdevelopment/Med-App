import { combineReducers } from 'redux';
import auth from './auth';
import message from './messages';
import loading from './loading';
import popUp from './popUp';
import groups from './groups';
import dependents from './dependents';
import table from './table';


export default combineReducers({
  auth,
  message,
  loading,
  popUp,
  groupState:groups,
  dependentState:dependents,
  table
});
