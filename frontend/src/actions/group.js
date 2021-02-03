import { FETCH_GROUPS } from './types';
import { createMessage } from './messages';
import { fetchCreateGuardian, fetchGuardians } from './guardian';
import { FETCH } from '../config/helpers';
import { toggleLoading } from './loading';

export const fetchGroups = (isLoading, done) => (dispatch) => {
  FETCH('GET', '/groups/', null, localStorage.getItem('JWT'), dispatch, isLoading, (err, res) => {
    if (err) {
      dispatch(createMessage(err, 'danger'));
    } else {
      dispatch({
        type: FETCH_GROUPS,
        payload: res
      });
      if (done) {
        done(res);
      }
    }
  });
}

export const addUser = (groupID, userBody, isLoading, done) => (dispatch) => {
  dispatch(fetchCreateGuardian(userBody, isLoading, (guardianCreated) => {
    dispatch(addGuardian(groupID, guardianCreated._id, isLoading, (guardianCreated) => {
      if (done) {
        done(guardianCreated);
      }
    }));
  }));
}

export const addGuardian = (groupID, guardianID, isLoading, done) => (dispatch) => {
  let updatedFields = { guardianID: guardianID };
  FETCH('PATCH', '/groups/' + groupID + '/', updatedFields, localStorage.getItem('JWT'), dispatch, isLoading, (err, res) => {
    if (err) {
      dispatch(createMessage(err, 'danger'));
    } else if (done) {
      done(res);
    }
  });
}

export const removeGuardian = (groupID, guardianID, isLoading, done) => (dispatch) => {
  let postData = {
    removeGuardianID: guardianID
  }
  FETCH('PATCH', '/groups/' + groupID + '/', postData, localStorage.getItem('JWT'), dispatch, isLoading, (err, res) => {
    if (err) {
      dispatch(createMessage(err, 'danger'));
    } else if (done) {
      done(res);
    }
  });
}

export const removeDependent = (groupID, dependentID, isLoading, done) => (dispatch) => {
  let postData = {
    removeDependentID: dependentID
  }
  FETCH('PATCH', '/groups/' + groupID + '/', postData, localStorage.getItem('JWT'), dispatch, isLoading, (err, res) => {
    if (err) {
      dispatch(createMessage(err, 'danger'));
    } else if (done) {
      done(res);
    }
  });
}

export const addDependent = (groupID, dependentID, isLoading, done) => (dispatch) => {
  let postData = {
    dependentID: dependentID
  }
  FETCH('PATCH', '/groups/' + groupID + '/', postData, localStorage.getItem('JWT'), dispatch, isLoading, (err, res) => {
    if (err) {
      dispatch(createMessage(err, 'danger'));
    } else if (done) {
      done(res);
    }
  });
}

export const fetchCreateGroup = (body, depAdd, guardAdd, done) => (dispatch) => {
  dispatch(toggleLoading(true));
  if(depAdd.length>0){
    body.dependentIDs = depAdd;
  }
  if(guardAdd.length>0){
    body.guardianIDs = guardAdd;
  }
  FETCH('POST', '/groups/', body, localStorage.getItem('JWT'), dispatch, false, (err, res) => {
    if (err) {
      dispatch(createMessage(err, 'danger'));
    } else {
        createGroupAfter(dispatch, done, res);
    }
  });
}

export const fetchUpdateGroup = (groupID, body, done) => (dispatch) => {
  dispatch(toggleLoading(true));
  FETCH('PATCH', '/groups/' + groupID + '/', body, localStorage.getItem('JWT'), dispatch, false, (err, res) => {
    if (err) {
      dispatch(createMessage(err, 'danger'));
    } else{
      updateGroupAfter(dispatch,done,res);
    }
  });
}

export const fetchDeleteGroup = (userID, done) => (dispatch) => {
  dispatch(toggleLoading(false));
  FETCH('DELETE', '/groups/' + userID + '/', null, localStorage.getItem('JWT'), dispatch, false, (err, res) => {
    if (err) {
      dispatch(createMessage(err, 'danger'));
    } else {
      dispatch(fetchGroups(false, (groups) => {
        dispatch(createMessage(res.name + " was successfully deleted.", "warning"));
        dispatch(toggleLoading(false));
        if (done) {
          done(res);
        }
      }));
    }
  });
}

function createGroupAfter(dispatch, done, res) {
  dispatch(toggleLoading(false));
  dispatch(createMessage(res.name + " was successfully created.", "warning"));
  dispatch(fetchGroups(false, (groups) => {
    if (done) {
      done(res);
    }
  }));
}

function updateGroupAfter(dispatch, done, res) {
  dispatch(toggleLoading(false));
  dispatch(createMessage(res.name + " was successfully updated.", "warning"));
  dispatch(fetchGroups(false, (groups) => {
    if (done) {
      done(res);
    }
  }));
}