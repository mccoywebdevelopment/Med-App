import { CREATE_MESSAGE, CHANGE_REDIRECT_URL } from './types';
import { togglePopUp } from './popUp';
import { toggleLoading } from './loading';


// CREATE MESSAGE
export const createMessage = (text,alertType,time) => (dispatch) =>{
  let timeout = 1200;

  if(typeof(text)=='object'){
    text = JSON.stringify(text);
  }
  if(alertType=='danger'){
    dispatch(toggleLoading(false));
    dispatch(togglePopUp());
    timeout = 15000;
  }
  dispatch({
    type: CREATE_MESSAGE,
    payload: {text, alertType},
  });
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
