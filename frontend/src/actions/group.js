import { FETCH_GROUPS } from './types';
import { createMessage } from './messages';
import { toggleLoading } from './loading';
import { API_URI } from '../config/variables';

export const fetchGroups = (done) => (dispatch) =>{
    dispatch(toggleLoading(true));
    fetch(API_URI + "/groups/" + localStorage.getItem('JWT'), {
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(res => {
      dispatch(toggleLoading(false));
      if (res.error) {
        dispatch(createMessage(res.error, 'danger'));
      } else {
        dispatch({
          type: FETCH_GROUPS,
          payload: res
        });
        done(null,"done");
      }
    });
  }


export const addDependent = (groupID, newDependent, oldDependents) => (dispatch) => {
  dispatch(toggleLoading(true));
  if (!oldDependents) {
    oldDependents = [];
  }
  oldDependents.push(newDependent);
  let updatedFields = {
    dependents: oldDependents
  }
  fetch(API_URI + "/groups/" + groupID + "/" + localStorage.getItem('JWT'), {
    method: 'PATCH',
    body: JSON.stringify({ updatedFields: updatedFields }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .then(res => {
      dispatch(toggleLoading(false));
      if (res.error) {
        dispatch(createMessage(res.error, 'danger'));
      }
    });
}