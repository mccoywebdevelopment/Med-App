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

export const fetchMedEvents = (rxsMedID,isLoading,done) => (dispatch) => {
  FETCH('GET', '/rxsMedication-event/'+rxsMedID+'/', null, localStorage.getItem('JWT'), dispatch, isLoading, (err, res) => {
    if (err) {
      dispatch(createMessage(err, 'danger'));
    }else{
      // dispatch(createMessage(res.t, "success"));
      if(done){
        done(res);
      }
    }
  });
}
