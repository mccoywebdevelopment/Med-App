import { createMessage } from './messages';
import { toggleLoading } from './loading';
import { FETCH_USERS } from './types';
import { addUser, addGuardian, removeGuardian } from './group';
import { fetchGuardians } from './guardian';
import { FETCH } from '../config/helpers';

export const fetchUsers = (isLoading, done) => (dispatch) => {
  FETCH('GET', '/users/', null, localStorage.getItem('JWT'), dispatch, isLoading, (err, res) => {
    if (err) {
      dispatch(createMessage(err, 'danger'));
    } else {
      dispatch(fetchGuardians(isLoading, (guardians) => {
        res = combineGuardian(res, guardians);
        dispatch({
          type: FETCH_USERS,
          payload: res
        });
        if (done) {
          done(res);
        }
      }));
    }
  });
}
function combineGuardian(users, guardians) {
  console.log(users);
  console.log(guardians);
  let data = users;

  for (var i = 0; i < guardians.length; ++i) {
    for (var ix = 0; ix < users.length; ++ix) {
      if (guardians[i].user == users[ix]._id) {
        data[ix].guardian = guardians[i];
      }
    }
  }
  return data;
}

export const fetchCreateUser = (body, groupID, done) => (dispatch) => {
  dispatch(toggleLoading(true));
  FETCH('POST', '/users/', body, localStorage.getItem('JWT'), dispatch, false, (err, res) => {
    if (err) {
      dispatch(createMessage(err, 'danger'));
    } else if (groupID.length > 0) {
      let guardianBody = {
        user: res
      }
      dispatch(addUser(groupID, guardianBody, false, (groups) => {
        createUserAfter(body.username,dispatch,done);
      }));
    } else {
      createUserAfter(body.username,dispatch,done);
    }
  });
}

function createUserAfter(email, dispatch, done) {
  dispatch(toggleLoading(false));
  dispatch(fetchUsers(false, (users) => {
    dispatch(sendTokenViaEmail(email, (res) => {
      if (done) {
        done(res);
      }
    }));
  }))
}

export const fetchDeleteUser = (userID, done) => (dispatch) => {
  dispatch(toggleLoading(false));
  FETCH('DELETE', '/users/' + userID + '/', null, localStorage.getItem('JWT'), dispatch, false, (err, res) => {
    if (err) {
      dispatch(createMessage(err, 'danger'));
    } else {
      dispatch(fetchUsers(false, (users) => {
        dispatch(createMessage(res.username + " was successfully deleted.", "info"));
        dispatch(toggleLoading(false));
        if (done) {
          done(res);
        }
      }));
    }
  });
}

export const fetchUpdateUser = (userID, body, isGroupModified, guardianID, done) => (dispatch) => {
  FETCH('PATCH', '/users/' + userID + '/', body, localStorage.getItem('JWT'), dispatch, false, (err, res) => {
    if (err) {
      dispatch(createMessage(err, 'danger'));
    } else if(isGroupModified){
      if (isGroupModified.isAdd) {
        dispatch(addGuardian(isGroupModified.groupID, guardianID, false, (guardianAdded) => {
          updateUserAfter(dispatch, done, res);
        }));
      } else if (isGroupModified.isRemoved) {
        dispatch(removeGuardian(isGroupModified.groupID, guardianID, false, (guardianAdded) => {
          updateUserAfter(dispatch, done, res);
        }));
      } else {
        dispatch(removeGuardian(isGroupModified.oldGroupID, guardianID, false, (depAdded) => {
          dispatch(addGuardian(isGroupModified.groupID, guardianID, false, (depRemoved) => {
            updateUserAfter(dispatch, done, res);
          }));
        }));
      }
    }else{
      updateUserAfter(dispatch, done, res);
    }
  });
}

function updateUserAfter(dispatch, done, res) {
  dispatch(fetchUsers(false, (users) => {
    dispatch(createMessage(res.username + " was successfully updated.", "success"));
    dispatch(toggleLoading(false));
    if (done) {
      done(res)
    }
  }));
}


export const sendTokenViaEmail = (email, done) => (dispatch) => {
  FETCH('GET', "/auth/email/send-welcome/" + email + "/", null, localStorage.getItem('JWT'), dispatch, false, (err, res) => {
    if (err) {
      dispatch(createMessage(err, 'danger'));
    } else if (done) {
      done(res);
    }
    dispatch(createMessage(email + " was sent another invitation via email.", "info"));
  });
}


