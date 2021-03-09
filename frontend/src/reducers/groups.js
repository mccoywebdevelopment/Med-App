import { FETCH_GROUPS } from '../actions/types';

const initialState = {
    fetched:false,
    data:[]
}
export default function(state = initialState, action){
    switch(action.type){
        case FETCH_GROUPS:
            return{
                ...state,
                fetched:true,
                data:action.payload
            }
        default:
            return state;
    }
}

