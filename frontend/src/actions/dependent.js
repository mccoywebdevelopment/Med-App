import { createMessage } from './messages';
import { toggleLoading } from './loading';
import { API_URI } from '../config/variables';
import { addDependent, removeDependent, switchDependent } from './group';
import { FETCH_DEPENDENTS } from './types';

// CREATE MESSAGE
/*
  isGroupModified:{
     groupID:group.value,
    isSwitched:true,
    isRemoved:false,
    isAdd:false
  } or null
*/

export const fetchUpdateDependent = (id,depBody,groups,isGroupModified,oldDependents,done) => (dispatch) => {
  depBody = {
    updatedFields:depBody
  }
  dispatch(toggleLoading(true));
  fetch(API_URI + "/dependents/"+id+"/"+localStorage.getItem('JWT'), {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(depBody)
  })
    .then(res => res.json())
    .then(res => {
      dispatch(toggleLoading(false));
      if (res.error) {
        dispatch(createMessage(res.error, 'danger'));
      } else {
        JSON.stringify(oldDependents);
        console.log(isGroupModified)
        if(isGroupModified){
          if(isGroupModified.isAdd){
            console.log("add");
            dispatch(addDependent(isGroupModified.groupID,res));
          }else if(isGroupModified.isRemoved){
            console.log("remove");
            dispatch(removeDependent(isGroupModified.groupID,res,oldDependents));
          }else{
            console.log("switch");
            dispatch(switchDependent(isGroupModified.groupID,isGroupModified.oldGroupID,res,oldDependents));
          }
        }else{
          console.log("not modified")
        }
        dispatch(createMessage(res.name.firstName + " was successfully updated.","success"));
        dispatch(fetchPopulatedDependents(()=>{
          done(res);
        }));
      }
    });
};

export const fetchCreateDependent = (depBody,groupID,oldDependents) => (dispatch) => {
  dispatch(toggleLoading(true));
  fetch(API_URI + "/dependents/"+localStorage.getItem('JWT'), {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(depBody)
  })
    .then(res => res.json())
    .then(res => {
      dispatch(toggleLoading(false));
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

export const fetchDeleteDependent = (depID,done) => (dispatch) => {
  fetch(API_URI + "/dependents/"+depID.toString()+"/"+localStorage.getItem('JWT'), {
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
        dispatch(createMessage(res.deletedDoc.name.firstName + " was successfully deleted.","info"));
        dispatch(fetchPopulatedDependents());
      }
    });
};

export const fetchPopulatedDependents = (done) => (dispatch) =>{
    dispatch(toggleLoading(true));
    fetch(API_URI + "/dependents/dependents-medication/medication/"+localStorage.getItem('JWT'), {
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(res => {
        dispatch(toggleLoading(false));
        if (res.error) {
          dispatch(createMessage(res.error,'danger'));
        }else{
            fetch_Groups(dispatch,function(groups){
              var dependents = res;
              for(var i=0;i<dependents.length;++i){
                dependents[i].group = "";
                for(var ix=0;ix<groups.length;++ix){
                  for(var z=0;z<groups[ix].dependents.length;++z){
                    if(dependents[i]._id == groups[ix].dependents[z]._id){
                      dependents[i].group = groups[ix]._id;
                    }
                  }
                }
              }
              dispatch({
                type: FETCH_DEPENDENTS,
                payload: dependents
              });
              if(done){
                done(null,"done");
              }
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
