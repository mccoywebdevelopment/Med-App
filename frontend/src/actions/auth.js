import { FETCH_LOGIN, CHANGE_REDIRECT_URL, FETCH_REGISTER } from './types';
import { createMessage } from './messages';
import { toggleLoading } from './loading';
import { API_URI } from '../config/variables';

export const fetchLogin = postData => dispatch => {
  dispatch(toggleLoading(true));
  fetch(API_URI + "/auth/login", {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(postData)
  })
    .then(res => res.json())
    .then(res => {
      dispatch(toggleLoading(false));
      if (res.error) {
        dispatch(createMessage(res.error, 'danger',20000));
      } else {
        localStorage.setItem("JWT",res.result.JWT);
        dispatch({
          type: FETCH_LOGIN,
          payload: res.result
        });
      }
    });
};

export const fetchResetPassword = postData => dispatch => {
  dispatch(toggleLoading(true));
  fetch(API_URI + "/auth/reset-password/"+localStorage.getItem('JWT'), {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(postData)
  })
    .then(res => res.json())
    .then(res => {
      dispatch(toggleLoading(false));
      if (res.error) {
        dispatch(createMessage(res.error, 'danger'));
      } else {
        dispatch(createMessage("Please check your email for further instructions.",'info',20000));
      }
    });
};

export const fetchRegister = (email,token,bodyData) => (dispatch) => {
  dispatch(toggleLoading(true));
  fetch(API_URI + "/auth/register/"+email+"/"+token, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(bodyData)
  })
    .then(res => res.json())
    .then(res => {
      dispatch(toggleLoading(false));
      if (res.error) {
        dispatch(createMessage(res.error, 'danger',20000));
      } else {
        localStorage.setItem("JWT",res.result.JWT);
        dispatch({
          type: FETCH_REGISTER,
          payload: res.result
        });
      }
    });
};


export const fetchForgotPassword = postData => dispatch => {
  dispatch(toggleLoading(true));
  fetch(API_URI + "/auth/email/forgot-password", {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(postData)
  })
    .then(res => res.json())
    .then(res => {
      dispatch(toggleLoading(false));
      if (res.error) {
        dispatch(createMessage(res.error, 'danger',20000));
      } else {
        dispatch(createMessage("Please check your email for further instructions.",'info',20000));
      }
    });
};

export const changeRedirectURL = newURL => dispatch => {
  dispatch({
    type: CHANGE_REDIRECT_URL,
    payload: newURL
  })
}
