import { FETCH_LOGIN, CHANGE_REDIRECT_URL, CHANGE_CURRENT_URL, 
  FETCH_REGISTER, FETCH_RESET_PASSWORD, FETCH_UPDATE_PROFILE } from './types';
import { createMessage } from './messages';
import { toggleLoading } from './loading';
import {FETCH} from "../config/helpers";

export const fetchLogin = (postData,callback) => dispatch => {
  FETCH('POST','/auth/login',postData,null,dispatch,true,(err,res)=>{
    if(err){
      dispatch(createMessage(err, 'danger',20000));
    }else{
      localStorage.setItem("JWT",res.result.JWT);
      dispatch({
        type: FETCH_LOGIN,
        payload: res.result
      });
      if(callback){
        callback(res);
      }
    }
  });
}

export const fetchResetPassword = (postData,token,callback) => (dispatch) => {
  FETCH('POST','/auth/reset-password/',postData,token,dispatch,true,(err,res)=>{
    if(err){
      dispatch(createMessage(err, 'danger'));
    }else{
      localStorage.setItem("JWT",res.result.JWT);
      dispatch({
        type: FETCH_RESET_PASSWORD,
        payload: res.result
      });
      window.location = "/user/home"
      if(callback){
        callback(res);
      }
    }
  });
}


export const fetchUpdateProfile = (body, done) => (dispatch) => {
  dispatch(toggleLoading(true));
  FETCH('POST', '/users/update-profile/', body, localStorage.getItem('JWT'), dispatch, false, (err, res) => {
    if (err) {
      dispatch(createMessage(err, 'danger'));
    }else{
      dispatch(toggleLoading(false));
      dispatch(createMessage("Your account has been successfully updated",'success',2000));
      dispatch({
        type: FETCH_UPDATE_PROFILE,
        payload: res.result
      });
      if(done){
        done(res);
      }
    }
  });
}

export const fetchRegister = (email,token,postData,callback) => (dispatch) => {
  FETCH('POST','/auth/register/'+email+'/'+token,postData,null,dispatch,true,(err,res)=>{
    if(err){
      dispatch(createMessage(err, 'danger',20000));
    }else{
      localStorage.setItem("JWT",res.result.JWT);
      dispatch({
        type: FETCH_REGISTER,
        payload: res.result
      });

      if(callback){
        callback(res);
      }
      
    }
  });
}

export const fetchForgotPassword = (postData) => (dispatch) => {
  FETCH('POST','/auth/email/forgot-password',postData,null,dispatch,true,(err,res)=>{
    if(err){
      dispatch(createMessage(err, 'danger',20000));
    }else{
      dispatch(createMessage("Please check your email for further instructions.",'info',20000));
    }
  });
}

export const fetchDeleteAccount = () => (dispatch) => {
  dispatch(toggleLoading(true));
  FETCH('POST','/auth/delete-account/'+localStorage.getItem('JWT'),null,null,dispatch,true,(err,res)=>{
    if(err){
      dispatch(createMessage(err, 'danger',20000));
    }else{
      dispatch(toggleLoading(false));
      dispatch(createMessage("Your account has been successfully deleted",'success',20000));
      setTimeout(function(){
        window.location = "/auth/login";
      },3000)
    }
  });
}

export const changeRedirectURL = newURL => dispatch => {
  dispatch({
    type: CHANGE_REDIRECT_URL,
    payload: newURL
  })
}

export const changeCurrentURL = newURL => dispatch => {
  dispatch({
    type: CHANGE_CURRENT_URL,
    payload: newURL
  });
}
