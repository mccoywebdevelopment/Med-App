import { createMessage } from './messages';
import { FETCH } from '../config/helpers';

export const fetchCreateMedEvent = (body, rxsMedID, isLoading, done) => (dispatch) => {
  body.dateTaken = formateDate(body.dateTaken);

  FETCH('POST', '/rxsMedication-event/'+rxsMedID+'/', body, localStorage.getItem('JWT'), dispatch, isLoading, (err, res) => {
    if (err) {
      dispatch(createMessage(err, 'danger'));
    }else{
      dispatch(createMessage(res.title, "success"));
      if(done){
        done(res);
      }
    }
  });
}

export const fetchUpdateMedEvent = (body, rxsMedID, isLoading, done) => (dispatch) => {
  body.dateTaken = formateDate(body.dateTaken);

  FETCH('PATCH', '/rxsMedication-event/'+rxsMedID+'/', body, localStorage.getItem('JWT'), dispatch, isLoading, (err, res) => {
    if (err) {
      dispatch(createMessage(err, 'danger'));
    }else{
      dispatch(createMessage(res.title, "success"));
      if(done){
        done(res);
      }
    }
  });
}

export const fetchMedEvents = (rxsMedID,isLoading,done) => (dispatch) => {
  FETCH('GET', '/rxsMedication-event/'+rxsMedID+'/', null, localStorage.getItem('JWT'), dispatch, isLoading, (err, res) => {
    if (err) {
      dispatch(createMessage(err, 'danger'));
    }else{
      if(done){
        done(res);
      }
    }
  });
}

export const fetchDeleteMedEvent = (rxsMedID,isLoading,done) => (dispatch) => {
  FETCH('DELETE', '/rxsMedication-event/'+rxsMedID+'/',null, localStorage.getItem('JWT'), dispatch, isLoading, (err, res) => {
    if (err) {
      dispatch(createMessage(err, 'danger'));
    }else{
      // dispatch(createMessage("Successfully deteted " + res.title, 'info'));
      if(done){
        done(res);
      }
    }
  });
}

function formateDate(date){
  let dates = date.split('-');
  let yyyy = dates[0];
  let mm = dates[1];
  let dd = dates[2];
  return(mm+"-"+dd+"-"+yyyy);
}