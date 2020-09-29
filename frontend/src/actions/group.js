import { FETCH_GROUPS } from './types';
import { createMessage } from './messages';
import { fetchCreateGuardian, fetchGuardians } from './guardian';
import { FETCH } from '../config/helpers';

export const fetchGroups = (isLoading, done) => (dispatch) => {
  FETCH('GET','/groups/',null,localStorage.getItem('JWT'),dispatch,isLoading,(err,res)=>{
    if(err){
      dispatch(createMessage(err, 'danger'));
    }else{
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
  dispatch(fetchCreateGuardian(userBody,isLoading,(guardianCreated)=>{
    dispatch(addGuardian(groupID,guardianCreated._id,isLoading,(guardianCreated)=>{
      if(done){
        done(guardianCreated);
      }
    }));
  }));
}

export const addGuardian = (groupID, guardianID, isLoading, done) => (dispatch) => {
    let updatedFields = { guardianID: guardianID };
    FETCH('PATCH', '/groups/' + groupID + '/',updatedFields, localStorage.getItem('JWT'), dispatch, isLoading, (err, res) => {
      if (err) {
        dispatch(createMessage(err, 'danger'));
      }else if(done){
        done(res);
      }
    });
}

export const removeGuardian = (groupID, guardianID, isLoading, done) => (dispatch) => {
  let postData = {
    removeGuardianID:guardianID
  }
  FETCH('PATCH', '/groups/' + groupID + '/',postData, localStorage.getItem('JWT'), dispatch, isLoading, (err, res) => {
    if (err) {
      dispatch(createMessage(err, 'danger'));
    }else if(done){
      done(res);
    }
  });
}

export const removeDependent = (groupID, dependentID, isLoading,done) => (dispatch) => {
  let postData = {
    removeDependentID:dependentID
  }
  FETCH('PATCH', '/groups/' + groupID + '/',postData, localStorage.getItem('JWT'), dispatch, isLoading, (err, res) => {
    if (err) {
      dispatch(createMessage(err, 'danger'));
    }else if(done){
      done(res);
    }
  });
}
export const addDependent = (groupID, dependentID, isLoading,done) => (dispatch) => {
  let postData = {
    dependentID:dependentID
  }
  FETCH('PATCH', '/groups/' + groupID + '/',postData, localStorage.getItem('JWT'), dispatch, isLoading, (err, res) => {
    if (err) {
      dispatch(createMessage(err, 'danger'));
    }else if(done){
      done(res);
    }
  });
}
