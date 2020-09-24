import { CREATE_MESSAGE, CHANGE_REDIRECT_URL } from './types';
import { togglePopUp } from './popUp';


// CREATE MESSAGE
export const createMessage = (text,alertType,time) => (dispatch) =>{
  if(typeof(text)=='object'){
    text = JSON.stringify(text);
  }
  if(alertType=='danger'){
    dispatch(togglePopUp());
  }
  dispatch({
    type: CREATE_MESSAGE,
    payload: {text, alertType},
  });
  let timeout = 4000;
  if(time){
    timeout = time;
  }
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
  },timeout)
};
