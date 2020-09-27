import { FETCH_LOGIN , CHANGE_REDIRECT_URL, FETCH_REGISTER, FETCH_RESET_PASSWORD} from '../actions/types';

const initialState = {
    JWT:null,
    isAdmin:false,
    redirectURL:null
}

export default function(state = initialState, action){
    switch(action.type){
        case FETCH_LOGIN:
            return{
                ...state,
                JWT: action.payload.JWT,
                isAdmin: action.payload,
                redirectURL:action.payload.redirectURL
            }
        case FETCH_REGISTER:
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
        case FETCH_RESET_PASSWORD:
            return{
                ...state,
                JWT: action.payload.JWT,
                isAdmin: action.payload,
                redirectURL:action.payload.redirectURL
            }
        default:
            return state;
    }
}

