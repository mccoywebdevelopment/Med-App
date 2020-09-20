import { createMessage } from './messages';
import { toggleLoading } from './loading';
import { API_URI } from '../config/variables';
import { FETCH_USERS } from './types';
import { addUser } from './group';

export const fetchUsers = (done) => (dispatch) => {
    dispatch(toggleLoading(true));
    fetch(API_URI + "/users/"+localStorage.getItem('JWT'), {
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      },
    })
      .then(res => res.json())
      .then(res => {
        dispatch(toggleLoading(false));
        if (res.error) {
          dispatch(createMessage(res.error, 'danger'));
        } else {
            dispatch({
                type: FETCH_USERS,
                payload: res
            });
            if(done){
              done(res);
            }
        }
      });
  };

  export const fetchCreateUser = (userBody,groupID) => (dispatch) => {
    dispatch(toggleLoading(true));
    fetch(API_URI + "/auth/email/create-user/"+localStorage.getItem('JWT'), {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(userBody)
    })
      .then(res => res.json())
      .then(res => {
        dispatch(toggleLoading(false));
        if (res.error) {
          dispatch(createMessage(res.error, 'danger'));
        } else {
          if(groupID.length>0){
            let guardianBody = {
              user:res
            }
            dispatch(addUser(groupID,guardianBody));
          }
          dispatch(createMessage(userBody.username + " was sent an invitation via email.","info"));
          dispatch(fetchUsers());
        }
      });
  };

  export const fetchDeleteUser = (depID,done) => (dispatch) => {
    fetch(API_URI + "/users/"+depID.toString()+"/"+localStorage.getItem('JWT'), {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(res => {
        // dispatch(toggleLoading());
        if (res.error) {
          dispatch(createMessage(res.error, 'danger'));
        } else {
          dispatch(createMessage(res.username + " was successfully deleted.","info"));
          dispatch(fetchUsers());
        }
        if(done){
          done(res);
        }
      });
  };