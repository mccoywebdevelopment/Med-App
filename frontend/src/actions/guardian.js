import { createMessage } from './messages';
import { toggleLoading } from './loading';
import { API_URI } from '../config/variables';
import { FETCH_GUARDIANS } from './types';
import { addGuardian } from './group';

export const fetchGuardians = () => (dispatch) => {
    dispatch(toggleLoading(true));
    fetch(API_URI + "/guardians/"+localStorage.getItem('JWT'), {
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      },
    })
      .then(res => res.json())
      .then(res => {
        dispatch(toggleLoading(false));
        if (res.error) {
          dispatch(createMessage(res.error, 'danger'));
        } else {
            dispatch({
                type: FETCH_GUARDIANS,
                payload: res
            });
        }
      });
  };

  export const fetchCreateGuardian = (guardianBody,done) => (dispatch) => {
    dispatch(toggleLoading(true));
    fetch(API_URI + "/guardians/"+localStorage.getItem('JWT'), {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(guardianBody)
    })
      .then(res => res.json())
      .then(res => {
        dispatch(toggleLoading(false));
        if (res.error) {
          dispatch(createMessage(res.error, 'danger'));
        } else {
          dispatch(fetchGuardians());
        }

        if(done){
          done(res);
        }
      });
  };

  export const fetchDeleteGuardian = (guardianID,done) => (dispatch) => {
    fetch(API_URI + "/guardians/"+guardianID.toString()+"/"+localStorage.getItem('JWT'), {
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
          dispatch(createMessage(res.guardianname + " was successfully deleted.","info"));
          dispatch(fetchGuardians());
        }
      });
  };