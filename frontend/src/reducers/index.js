import { combineReducers } from 'redux';
import auth from './auth';
import message from './messages';
import loading from './loading';
import popUp from './popUp';
import groups from './groups';
import dependents from './dependents';
import guardians from './guardians';
import users from './users';
import theme from './theme';
import settings from './settings';
import notifications from './notifications';

const appReducer = combineReducers({
  /* your app’s top-level reducers */
  auth,
  settings,
  message,
  loading,
  theme,
  popUp,
  notifications,
  groupState:groups,
  dependentState:dependents,
  userState:users,
  guardianState:guardians,
});

export const rootReducer = (state, action) => {
  if (action.type == 'RESET') {
    state = undefined
  }
  return appReducer(state, action)
}