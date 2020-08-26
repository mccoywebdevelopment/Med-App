import { FETCH_GROUPS } from '../actions/types';

const initialState = [];
export default function(state = initialState, action){
    switch(action.type){
        case FETCH_GROUPS:
            return(action.payload)
        default:
            return state;
    }
}

