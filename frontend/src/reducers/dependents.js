import { FETCH_DEPENDENTS } from '../actions/types';

const initialState = []

export default function(state = initialState, action){
    switch(action.type){
        case FETCH_DEPENDENTS:
            return(action.payload)
        default:
            return state;
    }
}
