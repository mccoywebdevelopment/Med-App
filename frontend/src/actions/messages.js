import { CREATE_MESSAGE, GET_ERRORS } from './types';

// CREATE MESSAGE
export const createMessage = (text,alertType) => {
  if(typeof(text)=='object'){
    text = JSON.stringify(text);
  }
  return {
    type: CREATE_MESSAGE,
    payload: {text, alertType},
  };
};
