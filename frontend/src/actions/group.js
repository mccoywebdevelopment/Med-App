import { FETCH_GROUPS } from './types';
import { createMessage } from './messages';
import { toggleLoading } from './loading';
import { fetchCreateGuardian } from './guardian';
import { API_URI } from '../config/variables';
import { FETCH } from '../config/helpers';

export const fetchGroups = (isLoading,done) => (dispatch) => {
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
        if (done) {
          done(res);
        }
      }
    });
}

export const addDependent = (groupID, newDependent, isLoading) => (dispatch) => {
  let postData = {
    dependent:newDependent
  }
  FETCH('PATCH', '/groups/' + groupID + '/',postData, localStorage.getItem('JWT'), dispatch, isLoading, (err, res) => {
    if (err) {
      dispatch(createMessage(err, 'danger'));
    }
  });
}

export const addUser = (groupID, user, done, rmLoading) => (dispatch) => {
  if (!rmLoading) {
    dispatch(toggleLoading(true));
  }
  dispatch(fetchCreateGuardian(user, (guardianCreated) => {
    let updatedFields = { guardian: guardianCreated };
    fetch(API_URI + "/groups/" + groupID + "/" + localStorage.getItem('JWT'), {
      method: 'PATCH',
      body: JSON.stringify({ updatedFields: updatedFields }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(res => {
        if (!rmLoading) {
          dispatch(toggleLoading(false));
        }
        if (res.error) {
          dispatch(createMessage(res.error, 'danger'));
        } else {
          if (done) {
            done(res);
          }
        }
      });
  }, rmLoading));
}

export const addGuardian = (groupID, guardian, rmLoading,done) => (dispatch) => {
  if (!rmLoading) {
    dispatch(toggleLoading(true));
  }
  let updatedFields = { guardian: guardian._id };
  fetch(API_URI + "/groups/" + groupID + "/" + localStorage.getItem('JWT'), {
    method: 'PATCH',
    body: JSON.stringify({ updatedFields: updatedFields }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .then(res => {
      if (!rmLoading) {
        dispatch(toggleLoading(false));
      }
      if (res.error) {
        dispatch(createMessage(res.error, 'danger'));
      } else {
        if (done) {
          done(res);
        }
      }
    });
}

export const removeDependent = (groupID, dependent, isLoading) => (dispatch) => {
  let postData = {
    removeDependent:dependent
  }
  FETCH('PATCH', '/groups/' + groupID + '/',postData, localStorage.getItem('JWT'), dispatch, isLoading, (err, res) => {
    if (err) {
      dispatch(createMessage(err, 'danger'));
    }
  });
}

// export const removeDependent = (groupID, depToDel, dependents) => (dispatch) => {
//   dispatch(toggleLoading(true));
//   dependents = removeByID(depToDel._id, dependents);
//   let updatedFields = { dependents: dependents };
//   fetch(API_URI + "/groups/" + groupID + "/" + localStorage.getItem('JWT'), {
//     method: 'PATCH',
//     body: JSON.stringify({ updatedFields: updatedFields }),
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   })
//     .then(res => res.json())
//     .then(res => {
//       dispatch(toggleLoading(false));
//       if (res.error) {
//         dispatch(createMessage(res.error, 'danger'));
//       }
//     });
// }

export const switchDependent = (newGroupID, oldGroupID, dep, dependents,done) => (dispatch) => {
  dispatch(toggleLoading(true));
  dependents = removeByID(dep._id, dependents);
  let updatedFields = { dependents: dependents };
  fetch(API_URI + "/groups/" + oldGroupID + "/" + localStorage.getItem('JWT'), {
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
      } else {
        dispatch(toggleLoading(true));
        let updatedFields = { dependent: dep };
        fetch(API_URI + "/groups/" + newGroupID + "/" + localStorage.getItem('JWT'), {
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
              if(done){
                done(res);
              }
            }
          });
      }
    });
}

export const switchGuardian = (newGroupID, oldGroupID, guardian, guardians, done) => (dispatch) => {
  dispatch(toggleLoading(true));
  guardians = removeByID(guardian._id, guardians);
  let updatedFields = { guardians: guardians };
  fetch(API_URI + "/groups/" + oldGroupID + "/" + localStorage.getItem('JWT'), {
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
      } else {
        dispatch(toggleLoading(true));
        let updatedFields = { guardian: guardian };
        fetch(API_URI + "/groups/" + newGroupID + "/" + localStorage.getItem('JWT'), {
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
              if(done){
                done(res);
              }
            }
          });
      }
    });
}

export const removeGuardian = (groupID, guardianToDel, guardians,done) => (dispatch) => {
  dispatch(toggleLoading(true));
  guardians = removeByID(guardianToDel._id, guardians);
  let updatedFields = { guardians: guardians };
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
        if(done){
          done(res);
        }
      }
    });
}

function removeByID(id, arr) {
  let newArr = [];
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i]._id != id) {
      newArr.push(arr[i]);
    }
  }
  return newArr;
}