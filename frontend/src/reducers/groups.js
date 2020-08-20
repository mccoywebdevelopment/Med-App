import { FETCH_GROUPS } from '../actions/types';

const initialState = {
    all:[]
}

export default function(state = initialState, action){
    switch(action.type){
        case FETCH_GROUPS:
            return{
                ...state,
                all:action.payload
            }
        default:
            return state;
    }
}

