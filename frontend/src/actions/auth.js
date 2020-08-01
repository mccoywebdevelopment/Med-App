import { FETCH_LOGIN } from './types';
import { API_URI } from '../config/variables';

export const fetchLogin = postData => dispatch => {
  console.log("fetch")
    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(postData)
    })
      .then(res => res.json())
      .then(post =>
        dispatch({
          type: FETCH_LOGIN,
          payload: post
        })
      );
  };