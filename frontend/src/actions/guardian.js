import { createMessage } from './messages';
import { FETCH_GUARDIANS } from './types';
import { fetchGroups } from './group';
import { FETCH } from '../config/helpers';

export const fetchGuardians = (isLoading, done) => (dispatch) => {
  FETCH('GET', '/guardians/', null, localStorage.getItem('JWT'), dispatch, isLoading, (err, guardians) => {
    if (err) {
      dispatch(createMessage(err, 'danger'));
    }
    dispatch(fetchGroups(isLoading, (groups) => {
      for (var i = 0; i < guardians.length; ++i) {
        guardians[i].groups = [];
        for (var ix = 0; ix < groups.length; ++ix) {
          for (var z = 0; z < groups[ix].guardians.length; ++z) {
            if (guardians[i]._id == groups[ix].guardians[z]._id) {
              guardians[i].groups.push(groups[ix]._id);
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
    }));
  });
}

export const fetchCreateGuardian = (body, isLoading, done) => (dispatch) => {
  FETCH('POST', '/guardians/', body, localStorage.getItem('JWT'), dispatch, isLoading, (err, res) => {
    if (err) {
      dispatch(createMessage(err, 'danger'));
    }
    dispatch(fetchGuardians(isLoading, (guardians) => {
      if (done) {
        done(res);
      }
    }));
  });
}
