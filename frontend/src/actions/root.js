import { RESET } from './types';

export const resetRoot = () => (dispatch) =>{
    dispatch({
        type: RESET
    });
}