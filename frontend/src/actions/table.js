import { SELECT_ITEM } from './types';

export const selectItem = (item,isSmall) => (dispatch) =>{
    dispatch({
        type: SELECT_ITEM,
        payload: {item:item,isSmall:isSmall}
    })
}