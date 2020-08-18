import { createMessage } from './messages';
import { toggleLoading } from './loading';
import { API_URI } from '../config/variables';
import { addDependent } from './group';

// CREATE MESSAGE

export const fetchCreateDependent = (depBody,groupID,oldDependents) => (dispatch) => {
  dispatch(toggleLoading());
  fetch(API_URI + "/dependents/"+localStorage.getItem('JWT'), {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(depBody)
  })
    .then(res => res.json())
    .then(res => {
      dispatch(toggleLoading());
      if (res.error) {
        dispatch(createMessage(res.error, 'danger'));
      } else {
        if(groupID.length>0){
          dispatch(addDependent(groupID,res,oldDependents));
        }
        dispatch(createMessage(depBody.firstName + " was successfully created.","success"));
      }
    });
};