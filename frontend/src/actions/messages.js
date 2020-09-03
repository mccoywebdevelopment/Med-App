import { CREATE_MESSAGE, CHANGE_REDIRECT_URL } from './types';
import { togglePopUp } from './popUp';


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
  setTimeout(()=>{
    dispatch({
      type: CREATE_MESSAGE,
      payload: {
        text:"",
        alertType:""
      }
    });
    if(text=="Token expired" || text=="User not found."){
      dispatch({
        type: CHANGE_REDIRECT_URL,
        payload:"/auth/login"
      })
    }
  },5000)
};
