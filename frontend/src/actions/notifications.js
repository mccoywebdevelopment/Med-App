import { FETCH } from '../config/helpers';
import { createMessage } from './messages';
import { toggleLoading } from './loading';
import { FETCH_NOTIFICATIONS, FETCH_DELETE_ALL_NOTIFICATIONS } from './types';

export const fetchNotifications = (isLoading, done) => (dispatch) => {
    FETCH('GET', '/notifications/', null, localStorage.getItem('JWT'), dispatch, isLoading, (err, res) => {
        if (err) {
            dispatch(createMessage(err, 'danger'));
        } else {
            dispatch({
                type: FETCH_NOTIFICATIONS,
                payload: res
            });
            if (done) {
                done(res);
            }
        }
    });
}

export const fetchDeleteAllNotifications = (isLoading, done) => (dispatch) => {
    dispatch(toggleLoading(true));

    FETCH('DELETE', '/notifications/', null, localStorage.getItem('JWT'), dispatch, isLoading, (err, res) => {
        dispatch(toggleLoading(false));
        if (err) {
            dispatch(createMessage(err, 'danger'));
        } else {
            dispatch({
                type: FETCH_DELETE_ALL_NOTIFICATIONS,
            });
            if (done) {
                done(res);
            }
        }
    });
}