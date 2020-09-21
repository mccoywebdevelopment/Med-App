import { createMessage } from './messages';
import { toggleLoading } from './loading';
import { API_URI } from '../config/variables';
import { FETCH_GUARDIANS } from './types';
import { addGuardian } from './group';

export const fetchGuardians = (done, rmLoading) => (dispatch) => {
  if (!rmLoading) {
    dispatch(toggleLoading(true));
  }
  fetch(API_URI + "/guardians/" + localStorage.getItem('JWT'), {
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
      } else {
        fetch_Groups(dispatch, function (groups) {
          var guardians = res;
          for (var i = 0; i < guardians.length; ++i) {
            guardians[i].group = "";
            for (var ix = 0; ix < groups.length; ++ix) {
              for (var z = 0; z < groups[ix].guardians.length; ++z) {
                if (guardians[i]._id == groups[ix].guardians[z]._id) {
                  guardians[i].group = groups[ix]._id;
                }
              }
            }
          }
          dispatch({
            type: FETCH_GUARDIANS,
            payload: guardians
          });
          if (done) {
            done(guardians);
          }
        });
      }
    });
};

export const fetchCreateGuardian = (guardianBody, done, rmLoading) => (dispatch) => {
  if (!rmLoading) {
    dispatch(toggleLoading(true));
  }
  fetch(API_URI + "/guardians/" + localStorage.getItem('JWT'), {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(guardianBody)
  })
    .then(res => res.json())
    .then(res => {
      if (!rmLoading) {
        dispatch(toggleLoading(false));
      }
      if (res.error) {
        dispatch(createMessage(res.error, 'danger'));
      } else {
        dispatch(fetchGuardians(null,rmLoading));
      }

      if (done) {
        done(res);
      }
    });
};

export const fetchDeleteGuardian = (guardianID, done) => (dispatch) => {
  fetch(API_URI + "/guardians/" + guardianID.toString() + "/" + localStorage.getItem('JWT'), {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(res => {;
      if (res.error) {
        dispatch(createMessage(res.error, 'danger'));
      } else {
        dispatch(createMessage(res.guardianname + " was successfully deleted.", "info"));
        dispatch(fetchGuardians());
      }
    });
};

function fetch_Groups(dispatch, callback) {
  fetch(API_URI + "/groups/" + localStorage.getItem('JWT'), {
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