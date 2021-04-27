import { FETCH_LOGIN , CHANGE_REDIRECT_URL, CHANGE_CURRENT_URL, FETCH_REGISTER, FETCH_RESET_PASSWORD, FETCH_UPDATE_PROFILE} from '../actions/types';

const initialState = {
    user:null,
    redirectURL:null,
    currentURL: null
}

export default function(state = initialState, action){
    switch(action.type){
        case FETCH_LOGIN:
            return{
                ...state,
                user:action.payload.user,
                // redirectURL:action.payload.redirectURL
            }
        case FETCH_REGISTER:
            return{
                ...state,
                user:action.payload.user,
                redirectURL:action.payload.redirectURL
            }
        case CHANGE_REDIRECT_URL:
            return{
                ...state,
                redirectURL:action.payload
            }
        case CHANGE_CURRENT_URL:
            return{
                ...state,
                currentURL:action.payload
            }
        case FETCH_RESET_PASSWORD:
            return{
                ...state,
                user:action.payload.user,
                redirectURL:action.payload.redirectURL
            }
        case FETCH_UPDATE_PROFILE:
            return{
                ...state,
                user:action.payload
            }
        default:
            return state;
    }
}

