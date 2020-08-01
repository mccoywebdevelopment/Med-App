import { FETCH_LOGIN } from '../actions/types';

const initialState = {
    login:null
}

export default function(state = initialState, action){
    switch(action.type){
        case FETCH_LOGIN:
            return{
                ...state,
                login: action.payload
            }
        default:
            return state;
    }
}