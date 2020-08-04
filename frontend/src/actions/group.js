import { FETCH_GROUPS } from './types';
import { createMessage } from './messages';
import { toggleLoading } from './loading';
import { API_URI } from '../config/variables';

export const fetchGroups = () => dispatch => {
  dispatch(toggleLoading());
  fetch(API_URI + "/groups/"+localStorage.getItem('JWT'), {
    method: 'GET',
    headers: {
      'content-type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(res => {
      dispatch(toggleLoading());
      if (res.error) {
        dispatch(createMessage(res.error, 'danger'));
      } else {
        dispatch({
          type: FETCH_GROUPS,
          payload: res
        })
      }
    });
};