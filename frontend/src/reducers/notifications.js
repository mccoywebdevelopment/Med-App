import { FETCH_NOTIFICATIONS, FETCH_DELETE_ALL_NOTIFICATIONS } from '../actions/types';

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
        case FETCH_DELETE_ALL_NOTIFICATIONS:
            return{
                ...state,
                fetched:true,
                dateFetched:new Date(),
                data:[]
            }
        default:
            return state;
    }
}
