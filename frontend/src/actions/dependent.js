import { createMessage } from './messages';
import { toggleLoading } from './loading';
import { API_URI } from '../config/variables';
import { addDependent, fetchGroups, removeDependent } from './group';
import { FETCH_DEPENDENTS } from './types';
import { FETCH } from '../config/helpers';

export const fetchUpdateDependent = (dependentID, postData, isGroupModified) => (dispatch) => {
  dispatch(toggleLoading(true));
  FETCH('PATCH', '/dependents/' + dependentID + '/', postData, localStorage.getItem('JWT'), dispatch, false, (err, res) => {
    if (err) {
      dispatch(createMessage(err, 'danger'));
    } else if (isGroupModified) {
      if (isGroupModified) {
        if (isGroupModified.isAdd) {
          dispatch(addDependent(isGroupModified.groupID, res, false));
        } else if (isGroupModified.isRemoved) {
          dispatch(removeDependent(isGroupModified.groupID, res));
        } else {
          dispatch(removeDependent(isGroupModified.oldGroupID, res));
          dispatch(addDependent(isGroupModified.groupID, res, false));
        }
      }
    }
    dispatch(fetchPopulatedDependents(false));
    dispatch(createMessage(res.name.firstName + " was successfully updated.", "success"));
    dispatch(toggleLoading(false));
  });
}

export const fetchCreateDependent = (postData, groupID) => (dispatch) => {
  dispatch(toggleLoading(true));
  FETCH('POST','/dependents/',postData,localStorage.getItem('JWT'),dispatch,false,(err,res)=>{
    if(err){
      dispatch(createMessage(err, 'danger'));
    }else if(groupID.length>0){
      //add dependent
    }
    dispatch(fetchPopulatedDependents(false));
    dispatch(createMessage(res.firstName + " was successfully created.", "success"));
    dispatch(toggleLoading(false));
  });
}

// export const fetchCreateDependent = (depBody, groupID, oldDependents) => (dispatch) => {
//   dispatch(toggleLoading(true));
//   fetch(API_URI + "/dependents/" + localStorage.getItem('JWT'), {
//     method: 'POST',
//     headers: {
//       'content-type': 'application/json'
//     },
//     body: JSON.stringify(depBody)
//   })
//     .then(res => res.json())
//     .then(res => {
//       dispatch(toggleLoading(false));
//       if (res.error) {
//         dispatch(createMessage(res.error, 'danger'));
//       } else {
//         if (groupID.length > 0) {
//           dispatch(addDependent(groupID, res, oldDependents));
//         }
//         dispatch(createMessage(depBody.firstName + " was successfully created.", "success"));
//         dispatch(fetchPopulatedDependents());
//       }
//     });
// };

export const fetchDeleteDependent = (depID, done) => (dispatch) => {
  fetch(API_URI + "/dependents/" + depID.toString() + "/" + localStorage.getItem('JWT'), {
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
        dispatch(createMessage(res.deletedDoc.name.firstName + " was successfully deleted.", "info"));
        dispatch(fetchPopulatedDependents());
      }
    });
};

export const fetchPopulatedDependents = (isLoading, done) => (dispatch) => {
  FETCH('POST', '/dependents/dependents-medication/medication/', null, localStorage.getItem('JWT'), dispatch, isLoading, (err, dependents) => {
    if (err) {
      dispatch(createMessage(err, 'danger'));
    } else {
      dispatch(fetchGroups(false, (err, groups) => {
        if (err) {
          dispatch(createMessage(err, 'danger'));
        } else {
         dependents = attatchGroup(dependents,groups);
         dispatch({
           type: FETCH_DEPENDENTS,
           payload: dependents
         });
         if(done){
           done(dependents);
         }
        }
      }));
    }
  });
}

function attatchGroup(dependents, groups) {
  for (var i = 0; i < dependents.length; ++i) {
    dependents[i].group = "";
    for (var ix = 0; ix < groups.length; ++ix) {
      for (var z = 0; z < groups[ix].dependents.length; ++z) {
        if (dependents[i]._id == groups[ix].dependents[z]._id) {
          dependents[i].group = groups[ix]._id;
        }
      }
    }
  }
}

