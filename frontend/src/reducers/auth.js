import { FETCH_LOGIN } from '../actions/types';

const initialState = {
    jwt:null,
    isAdmin:false
}

export default function(state = initialState, action){
    switch(action.type){
        case FETCH_LOGIN:
            return{
                ...state,
                JWT: action.payload
            }
        default:
            return state;
    }
}