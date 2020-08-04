import { CREATE_MESSAGE } from './types';
import { togglePopUp } from './popUp'


// CREATE MESSAGE
export const createMessage = (text,alertType) => (dispatch) =>{
  if(typeof(text)=='object'){
    text = JSON.stringify(text);
  }
  if(alertType=='danger'){
    dispatch(togglePopUp());
  }
  dispatch({
    type: CREATE_MESSAGE,
    payload: {text, alertType},
  })
};
