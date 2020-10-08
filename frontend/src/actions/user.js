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
      dispatch(fetchGuardians(false, (guardians) => {
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

export const fetchCreateUser = (body, groupIDs, done) => (dispatch) => {
  dispatch(toggleLoading(true));
  FETCH('POST', '/users/', body, localStorage.getItem('JWT'), dispatch, false, (err, res) => {
    if (err) {
      dispatch(createMessage(err, 'danger'));
    } else if (groupIDs.length > 0) {
      let guardianBody = {
        user: res
      }
      let i = 0;
      groupIDs.forEach(groupID => {
        dispatch(addUser(groupID, guardianBody, false, (groups) => {
          if (err) {
            dispatch(createMessage(err, 'danger'));
            return;
          } else if (i == groupIDs.length - 1) {
            createUserAfter(body.username, dispatch, done);
            return;
          }
          i++;
        }));
      });
    } else {
      createUserAfter(body.username, dispatch, done);
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
    } else if (isGroupModified) {
      let totalLen = isGroupModified.groups.length + isGroupModified.oldGroups.length;
      let i = 0;

      isGroupModified.groups.forEach(groupID =>{
        dispatch(addGuardian(groupID, guardianID, false, (guardianAdded) => {
          if (err) {
            dispatch(createMessage(err, 'danger'));
            return;
          } else if (i == totalLen - 1) {
            updateUserAfter(dispatch, done, res);
            return;
          }
          i++;
        }));
      });

      isGroupModified.oldGroups.forEach(groupID =>{
        dispatch(removeGuardian(groupID, guardianID, false, (guardianAdded) => {
          if (err) {
            dispatch(createMessage(err, 'danger'));
            return;
          } else if (i == totalLen - 1) {
            updateUserAfter(dispatch, done, res);
            return;
          }
          i++;
        }));
      });
    } else {
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
    dispatch(createMessage(email + " was sent an invitation via email.", "info"));
  });
}


