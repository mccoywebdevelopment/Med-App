import { FETCH_GUARDIANS } from '../actions/types';

const initialState = {
    fetched:false,
    data:[]
}

export default function(state = initialState, action){
    switch(action.type){
        case FETCH_GUARDIANS:
            return{
                ...state,
                fetched:true,
                data:action.payload
            }
        default:
            return state;
    }
}
