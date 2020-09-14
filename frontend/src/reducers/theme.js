import { CHANGE_PAGE_PRIMARY_COLOR } from '../actions/types';

const initialState = {
    pagePrimaryColor:"#2196f3"
}

export default function(state = initialState, action){
    switch(action.type){
        case CHANGE_PAGE_PRIMARY_COLOR:
            return{
                ...state,
                pagePrimaryColor:action.payload
            }
        default:
            return state;
    }
}

