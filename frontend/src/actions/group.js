import { FETCH_GROUPS } from './types';
import { createMessage } from './messages';
import { fetchCreateGuardian, fetchGuardians } from './guardian';
import { FETCH } from '../config/helpers';
import { toggleLoading } from './loading';

export const fetchGroups = (isLoading, done) => (dispatch) => {
  FETCH('GET', '/groups/', null, localStorage.getItem('JWT'), dispatch, isLoading, (err, res) => {
    if (err) {
      dispatch(createMessage(err, 'danger'));
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

export const addUser = (groupID, userBody, isLoading, done) => (dispatch) => {
  dispatch(fetchCreateGuardian(userBody, isLoading, (guardianCreated) => {
    dispatch(addGuardian(groupID, guardianCreated._id, isLoading, (guardianCreated) => {
      if (done) {
        done(guardianCreated);
      }
    }));
  }));
}

export const addGuardian = (groupID, guardianID, isLoading, done) => (dispatch) => {
  let updatedFields = { guardianID: guardianID };
  FETCH('PATCH', '/groups/' + groupID + '/', updatedFields, localStorage.getItem('JWT'), dispatch, isLoading, (err, res) => {
    if (err) {
      dispatch(createMessage(err, 'danger'));
    } else if (done) {
      done(res);
    }
  });
}

export const removeGuardian = (groupID, guardianID, isLoading, done) => (dispatch) => {
  let postData = {
    removeGuardianID: guardianID
  }
  FETCH('PATCH', '/groups/' + groupID + '/', postData, localStorage.getItem('JWT'), dispatch, isLoading, (err, res) => {
    if (err) {
      dispatch(createMessage(err, 'danger'));
    } else if (done) {
      done(res);
    }
  });
}

export const removeDependent = (groupID, dependentID, isLoading, done) => (dispatch) => {
  let postData = {
    removeDependentID: dependentID
  }
  FETCH('PATCH', '/groups/' + groupID + '/', postData, localStorage.getItem('JWT'), dispatch, isLoading, (err, res) => {
    if (err) {
      dispatch(createMessage(err, 'danger'));
    } else if (done) {
      done(res);
    }
  });
}

export const addDependent = async(groupID, dependentID, isLoading, done) => (dispatch) => {
  let postData = {
    dependentID: dependentID
  }
  FETCH('PATCH', '/groups/' + groupID + '/', postData, localStorage.getItem('JWT'), dispatch, isLoading, (err, res) => {
    if (err) {
      dispatch(createMessage(err, 'danger'));
    } else if (done) {
      done(res);
    }
  });
}

// export const fetchCreateGroup = (body, depAdd, guardAdd, depDel, guardDel, done) => (dispatch) => {
//   dispatch(toggleLoading(true));
//   FETCH('POST', '/groups/', body, localStorage.getItem('JWT'), dispatch, false, (err, res) => {
//     if (err) {
//       dispatch(createMessage(err, 'danger'));
//     } else {
//       let totalLen = depAdd.length + depDel.length + guardAdd.length + guardDel.length;
//       let i = 0;

//       if (totalLen < 1) {
//         createGroupAfter(dispatch, done, res);
//       } else {

//         depAdd.forEach(id => {
//           dispatch(addDependent(res._id, id, false, (depAdded) => {
//             if (err) {
//               dispatch(createMessage(err, 'danger'));
//               return;
//             } else if (i == totalLen - 1) {
//               createGroupAfter(dispatch, done, res);
//               return;
//             }
//             i++;
//           }));
//         });

//       }
//     }
//   });
// }

function synAddDependent(ids,callback){

}
export const fetchCreateGroup = (body, depAdd, guardAdd, done) => (dispatch) => {
  dispatch(toggleLoading(true));
  body.dependentIDs = depAdd;
  FETCH('POST', '/groups/', body, localStorage.getItem('JWT'), dispatch, false, (err, res) => {
    if (err) {
      dispatch(createMessage(err, 'danger'));
    } else {
      // let totalLen = depAdd.length + guardAdd.length;
      // let i = 0;

      // if (totalLen < 1) {
      //   createGroupAfter(dispatch, done, res);
      // } else {
        createGroupAfter(dispatch, done, res);

        

        // depAdd.forEach(id => {
        //   await addDependent(res._id, id, false, (depAdded) => {
        //     if (err) {
        //       dispatch(createMessage(err, 'danger'));
        //       return;
        //     } else if (i == totalLen - 1) {
        //       createGroupAfter(dispatch, done, res);
        //       return;
        //     }
        //     i++;
        //   });
        // });

        // guardAdd.forEach(id => {
        //   dispatch(addGuardian(res._id, id, false, (guardAdded) => {
        //     if (err) {
        //       dispatch(createMessage(err, 'danger'));
        //       return;
        //     } else if (i == totalLen - 1) {
        //       createGroupAfter(dispatch, done, res);
        //       return;
        //     }
        //     i++;
        //   }));
        // });
    }
  });
}

function createGroupAfter(dispatch, done, res) {
  dispatch(toggleLoading(false));
  dispatch(createMessage(res.name + " was successfully created.", "warning"));
  dispatch(fetchGroups(false, (groups) => {
    if (done) {
      done(res);
    }
  }));
}
