import { CHANGE_PAGE_PRIMARY_COLOR } from './types';

export const changeColor = (color) => (dispatch) =>{
    dispatch({
        type: CHANGE_PAGE_PRIMARY_COLOR,
        payload: color
    })
}