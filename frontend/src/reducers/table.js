import { SELECT_ITEM } from '../actions/types';

const initialState = {
    itemSelected:"",
    isSmall:false
}

export default function(state = initialState, action){
    switch(action.type){
        case SELECT_ITEM:
            return {
                ...state,
                itemSelected:action.payload.item,
                isSmall:action.payload.isSmall
            }
        default:
            return state;
    }
}
