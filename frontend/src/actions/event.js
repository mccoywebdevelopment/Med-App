import { createMessage } from './messages';
import { FETCH } from '../config/helpers';

export const fetchCreateMedEvent = (body, rxsMedID, isLoading, done) => (dispatch) => {
  alert(true)
  FETCH('POST', '/rxsMedication-event/'+rxsMedID+'/', body, localStorage.getItem('JWT'), dispatch, isLoading, (err, res) => {
    if (err) {
      dispatch(createMessage(err, 'danger'));
    }else{
      dispatch(createMessage(res, "success"));
      if(done){
        done(res);
      }
    }
  });
}
