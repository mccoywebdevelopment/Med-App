import { FETCH_LOGIN, CHANGE_REDIRECT_URL, FETCH_REGISTER, FETCH_RESET_PASSWORD } from './types';
import { createMessage } from './messages';
import { toggleLoading } from './loading';
import {FETCH} from "../config/helpers";

export const fetchLogin = postData => dispatch => {
  FETCH('POST','/auth/login',postData,null,dispatch,true,(err,res)=>{
    if(err){
      dispatch(createMessage(err, 'danger',20000));
    }else{
      localStorage.setItem("JWT",res.result.JWT);
      dispatch({
        type: FETCH_LOGIN,
        payload: res.result
      });
    }
  });
}

export const fetchResetPassword = (postData,token) => (dispatch) => {
  FETCH('POST','/auth/reset-password/',postData,token,dispatch,true,(err,res)=>{
    if(err){
      dispatch(createMessage(err, 'danger'));
    }else{
      localStorage.setItem("JWT",res.result.JWT);
      dispatch({
        type: FETCH_RESET_PASSWORD,
        payload: res.result
      });
    }
  });
}

export const fetchRegister = (email,token,postData) => (dispatch) => {
  FETCH('POST','/auth/register/'+email+'/'+token,postData,null,dispatch,true,(err,res)=>{
    if(err){
      dispatch(createMessage(err, 'danger',20000));
    }else{
      localStorage.setItem("JWT",res.result.JWT);
      dispatch({
        type: FETCH_REGISTER,
        payload: res.result
      });
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
  FETCH('POST','/auth/delete-account',null,null,dispatch,true,(err,res)=>{
    if(err){
      dispatch(createMessage(err, 'danger',20000));
    }else{
      dispatch(toggleLoading(false));
      dispatch(createMessage("Your account has been successfully deleted",'success',20000));
    }
  });
}

export const changeRedirectURL = newURL => dispatch => {
  dispatch({
    type: CHANGE_REDIRECT_URL,
    payload: newURL
  })
}
