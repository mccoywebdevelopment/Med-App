import { FETCH_USERS } from '../actions/types';
import { sortByLastNameUser } from '../config/helpers';

const initialState = {
    fetched:false,
    data:[]
}

export default function(state = initialState, action){
    switch(action.type){
        case FETCH_USERS:
            return{
                ...state,
                fetched:true,
                data:sortByLastNameUser(action.payload)
            }
        default:
            return state;
    }
}
