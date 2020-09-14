import { FETCH_LOGIN , CHANGE_REDIRECT_URL, FETCH_REGISTER} from '../actions/types';

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
        default:
            return state;
    }
}

