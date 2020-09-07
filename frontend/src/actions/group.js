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


export const addDependent = (groupID, newDependent) => (dispatch) => {
  dispatch(toggleLoading(true));
  let updatedFields = {dependent:newDependent}; 
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

export const removeDependent = (groupID, depToDel, dependents) => (dispatch) => {
  dispatch(toggleLoading(true));
  dependents = removeByID(depToDel._id,dependents);
  let updatedFields = {dependents:dependents}; 
  alert(JSON.stringify(updatedFields));
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

export const switchDependent = (groupID, dep, dependents) => (dispatch) => {
  dispatch(toggleLoading(true));
  dependents = removeByID(dep._id,dependents);
  let updatedFields = {dependents:dependents}; 
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
      }else{
        dispatch(toggleLoading(true));
        let updatedFields = {dependent:dep}; 
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
    });
}

function removeByID(id,arr){
  let newArr = [];
  for(var i=0;i<arr.length;++i){
    if(arr[i]._id != id){
      newArr.push(arr[i]);
    }
  }
  return newArr;
}