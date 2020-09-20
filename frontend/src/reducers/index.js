import { combineReducers } from 'redux';
import auth from './auth';
import message from './messages';
import loading from './loading';
import popUp from './popUp';
import groups from './groups';
import dependents from './dependents';
import guardians from './guardians';
import users from './users';
import table from './table';
import theme from './theme';

const appReducer = combineReducers({
  /* your app’s top-level reducers */
  auth,
  message,
  loading,
  popUp,
  groupState:groups,
  dependentState:dependents,
  userState:users,
  guardianState:guardians,
  table,
  theme
});

export const rootReducer = (state, action) => {
  if (action.type == 'RESET') {
    state = undefined
  }
  return appReducer(state, action)
}