import { createMessage } from './messages';
import { FETCH } from '../config/helpers';

export const fetchCreateMedEvent = (body, rxsMedID, isLoading, done) => (dispatch) => {

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

export const fetchCreateMedEventRefID = (body, refID, isLoading, done) => (dispatch) => {

  FETCH('POST', '/rxsMedication-event/took-event/refID/'+refID, body,
     null, dispatch, isLoading, (err, res) => {
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

  FETCH('PATCH', '/rxsMedication-event/'+rxsMedID+'/', body, localStorage.getItem('JWT'), dispatch, isLoading, (err, res) => {
    if (err) {
      dispatch(createMessage(err, 'danger'));
    }else{
      // dispatch(createMessage(res.title, "success"));
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
      if(done){
        done(res);
      }
    }
  });
}
