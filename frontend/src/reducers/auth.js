import { FETCH_LOGIN , CHANGE_REDIRECT_URL} from '../actions/types';

const initialState = {
    jwt:null,
    isAdmin:false,
    redirectURL:null
}

export default function(state = initialState, action){
    switch(action.type){
        case FETCH_LOGIN:
            return{
                ...state,
                JWT: action.payload.JWT,
                redirectURL:action.payload.redirectURL
            }
        case CHANGE_REDIRECT_URL:
            return{
                ...state,
                redirectURL:action.payload
            }
        default:
            return state;
    }
}

