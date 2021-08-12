import { FETCH_DEPENDENTS } from '../actions/types';
import { sortByLastNameDep } from '../config/helpers';

const initialState = {
    fetched:false,
    data:[]
}

export default function(state = initialState, action){
    switch(action.type){
        case FETCH_DEPENDENTS:
            return{
                ...state,
                fetched:true,
                data:sortByLastNameDep(action.payload)
            }
        default:
            return state;
    }
}
