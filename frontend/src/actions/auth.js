import { FETCH_LOGIN, CHANGE_REDIRECT_URL } from './types';
import { createMessage } from './messages';
import { toggleLoading } from './loading';
import { API_URI } from '../config/variables';
import store from '../store';

export const fetchLogin = postData => dispatch => {
  console.log(store)
  dispatch(toggleLoading());
  fetch(API_URI + "/auth/login", {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(postData)
  })
    .then(res => res.json())
    .then(res => {
      dispatch(toggleLoading());
      if (res.error) {
        dispatch(createMessage(res.error, 'danger'));
      } else {
        console.log(res.result.JWT);
        localStorage.setItem("JWT",res.result.JWT);
        dispatch({
          type: FETCH_LOGIN,
          payload: res.result
        })
      }
    });
};

export const changeRedirectURL = newURL => dispatch => {
  dispatch({
    type: CHANGE_REDIRECT_URL,
    payload: newURL
  })
}