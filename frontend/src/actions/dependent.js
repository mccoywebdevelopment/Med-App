import { createMessage } from './messages';
import { toggleLoading } from './loading';
import { API_URI } from '../config/variables';
import { addDependent, fetchGroups } from './group';
import { FETCH_DEPENDENTS, FETCH_GROUPS } from './types';

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
        dispatch(fetchPopulatedDependents());
      }
    });
};

export const fetchPopulatedDependents = () => (dispatch) =>{
    dispatch(toggleLoading());
    fetch(API_URI + "/dependents/dependents-medication/medication/"+localStorage.getItem('JWT'), {
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(res => {
        dispatch(toggleLoading());
        if (res.error) {
          dispatch(createMessage(res.error,'danger'));
        }else{
            fetch_Groups(dispatch,function(groups){
              var dependents = res;
              console.log(dependents);
              for(var i=0;i<dependents.length;++i){
                dependents[i].groups = [];
                for(var ix=0;ix<groups.length;++ix){
                  for(var z=0;z<groups[ix].dependents.length;++z){
                    if(dependents[i]._id == groups[ix].dependents[z]._id){
                      dependents[i].groups.push(groups[ix]);
                    }
                  }
                }
              }
              dispatch({
                type: FETCH_DEPENDENTS,
                payload: dependents
              })
            });
          }
      });
    
};

function fetch_Groups(dispatch,callback){
  fetch(API_URI + "/groups/"+localStorage.getItem('JWT'), {
    method: 'GET',
    headers: {
      'content-type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(res => {
      if (res.error) {
        dispatch(createMessage(res.error, 'danger'));
      } else {
        callback(res);
      }
    });
  } 
