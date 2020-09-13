import { createMessage } from './messages';
import { toggleLoading } from './loading';
import { API_URI } from '../config/variables';
import { FETCH_USERS } from './types';

export const fetchUsers = () => (dispatch) => {
    dispatch(toggleLoading(true));
    fetch(API_URI + "/users/"+localStorage.getItem('JWT'), {
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
                type: FETCH_USERS,
                payload: res
            });
        }
      });
  };