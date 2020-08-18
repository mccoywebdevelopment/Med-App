import { FETCH_CREATE_DEPENDENT } from '../actions/types';

const initialState = {
    dependents:[]
}

export default function(state = initialState, action){
    switch(action.type){
        case FETCH_CREATE_DEPENDENT:
            return{
                ...state
            }
        default:
            return state;
    }
}
