import { createMessage } from './messages';
import { toggleLoading } from './loading';
import { API_URI } from '../config/variables';
import { FETCH_USERS } from './types';
import { addUser, addGuardian, removeGuardian, switchGuardian } from './group';
import { fetchGuardians, fetchCreateGuardian } from './guardian';

export const fetchUsers = (isAdditionalData, done, rmLoading) => (dispatch) => {
  if (!rmLoading) {
    dispatch(toggleLoading(true));
  }
  fetch(API_URI + "/users/" + localStorage.getItem('JWT'), {
    method: 'GET',
    headers: {
      'content-type': 'application/json'
    },
  })
    .then(res => res.json())
    .then(res => {
      if (!rmLoading) {
        dispatch(toggleLoading(false));
      }
      if (res.error) {
        dispatch(createMessage(res.error, 'danger'));
      } else if (isAdditionalData) {
        dispatch(fetchGuardians((guardians) => {
          res = combineGuardian(res, guardians);
          dispatch({
            type: FETCH_USERS,
            payload: res
          });
          if (done) {
            done(res);
          }
        }));
      } else {
        dispatch({
          type: FETCH_USERS,
          payload: res
        });
        if (done) {
          done(res);
        }
      }
    });
};
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
export const fetchCreateUser = (userBody, groupID) => (dispatch) => {
  dispatch(toggleLoading(true));
  fetch(API_URI + "/auth/email/create-user/" + localStorage.getItem('JWT'), {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(userBody)
  })
    .then(res => res.json())
    .then(res => {
      if (res.error) {
        dispatch(createMessage(res.error, 'danger'));
      } else {
        dispatch(toggleLoading(false));
        if (groupID.length > 0) {
          let guardianBody = {
            user: res
          }
          dispatch(addUser(groupID, guardianBody, (group) => {
            dispatch(createMessage(userBody.username + " was sent an invitation via email.", "info"));
            dispatch(fetchUsers(true, null,true));
          },true));
        }else{
          dispatch(fetchUsers(true, null,true));
        }
      }
    });
};

export const fetchDeleteUser = (depID, done) => (dispatch) => {
  fetch(API_URI + "/users/" + depID.toString() + "/" + localStorage.getItem('JWT'), {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(res => {
      if (res.error) {
        dispatch(createMessage(res.error, 'danger'));
      } else {
        dispatch(createMessage(res.username + " was successfully deleted.", "info"));
        dispatch(fetchUsers());
      }
      if (done) {
        done(res);
      }
    });
};
/*need to check if user is modified and then check if group isModified.*/
export const fetchUpdateUser = (id,userBody,isGroupModified,guardians,guardian,done) => (dispatch) => {

  let updateBody = {
    updatedFields:userBody
  }
  dispatch(toggleLoading(true));
  fetch(API_URI + "/users/"+id+"/"+localStorage.getItem('JWT'), {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(updateBody)
  })
    .then(res => res.json())
    .then(res => {
      dispatch(toggleLoading(false));
      if (res.error) {
        dispatch(createMessage(res.error, 'danger'));
      } else {
        /* Need */
        if(isGroupModified){
          if(!guardian){
            dispatch(fetchCreateGuardian({user:id},(guardian)=>{
              updateGroupData(dispatch,isGroupModified,guardian,guardians,()=>{
                sendback(dispatch,res,id,(user)=>{
                  done(user);
                });
              });
            },true));
          }else{
            updateGroupData(dispatch,isGroupModified,guardian,guardians,()=>{
              sendback(dispatch,res,id,(user)=>{
                done(user);
              });
            });
          }
        }
          dispatch(createMessage(res.username + " was successfully updated.","success"));
          dispatch(fetchUsers(true,(users)=>{
            let user = null;
            if(done){
              for(var i=0;i<users.length;++i){
                if(users[i]._id == id){
                  user = users[i];
                }
              }
              if(!user){
                alert("Error 3234299077424 Couldn't find user.")
              }
              done(user)
            }
          }));
        }
    });
};

function sendback(dispatch,res,id,callback){
  dispatch(createMessage(res.username + " was successfully updated.","success"));
  dispatch(fetchUsers(true,(users)=>{
    let user = null;
      for(var i=0;i<users.length;++i){
        if(users[i]._id == id){
          user = users[i];
        }
      }
      if(!user){
        alert("Error 3234299077424 Couldn't find user.")
      }
      callback(user)
    }));
}

function updateGroupData(dispatch,isGroupModified,guardian,guardians,callback){
  if(isGroupModified.isAdd){
    dispatch(addGuardian(isGroupModified.groupID,guardian,true,()=>callback()));
  }else if(isGroupModified.isRemoved){
    dispatch(removeGuardian(isGroupModified.groupID,guardian,guardians,()=>callback()));
  }else{
    dispatch(switchGuardian(isGroupModified.groupID,isGroupModified.oldGroupID,guardian,guardians,()=>callback()));
  }
}