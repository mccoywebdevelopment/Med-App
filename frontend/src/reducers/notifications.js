import { FETCH_NOTIFICATIONS } from '../actions/types';

const initialState = {
    fetched:false,
    dateFetched:null,
    data:[]
}

export default function(state = initialState, action){
    switch(action.type){
        case FETCH_NOTIFICATIONS:
            return{
                ...state,
                fetched:true,
                dateFetched:new Date(),
                data:action.payload
            }
        default:
            return state;
    }
}
