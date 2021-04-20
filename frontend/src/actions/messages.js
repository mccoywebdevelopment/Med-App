import { CREATE_MESSAGE, CHANGE_REDIRECT_URL, CHANGE_CURRENT_URL } from './types';
import { togglePopUp } from './popUp';
import { toggleLoading } from './loading';


// CREATE MESSAGE
export const createMessage = (text,alertType,time) => (dispatch) =>{
  let timeout = 3000;

  if(typeof(text)=='object'){
    text = JSON.stringify(text);
  }
  if(alertType=='danger'){
    dispatch(toggleLoading(false));
    dispatch(togglePopUp());
    timeout = 15000;
  }
  if(time){
    timeout = time;
  }
  if(text=="Token expired" || text=="User not found." || text=="Token is undefined."){
    
    dispatch({
      type: CREATE_MESSAGE,
      payload: {
        text:"",
        alertType:""
      },
    });
    
    window.location = '/auth/login';
  }
  dispatch({
    type: CREATE_MESSAGE,
    payload: {
      text:text,
      alertType:alertType
    },
  });
  setTimeout(()=>{
    dispatch({
      type: CREATE_MESSAGE,
      payload: {
        text:"",
        alertType:""
      },
    });
  },10000000)
};
