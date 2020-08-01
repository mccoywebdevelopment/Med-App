import { FETCH_LOGIN } from './types';
import { createMessage } from './messages';
import { toggleLoading } from './loading';
import { API_URI } from '../config/variables';

export const fetchLogin = postData => dispatch => {
    dispatch(toggleLoading());
    fetch(API_URI+"/auth/login", {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(postData)
    })
      .then(res => res.json())
      .then(jwt =>{
        dispatch(toggleLoading());
        if(jwt.error){
          dispatch(createMessage(jwt.error,'danger'));
        }else{
          dispatch({
            type: FETCH_LOGIN,
            payload: jwt
          })
        }
      });
  };