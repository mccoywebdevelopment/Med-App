import { SUBMIT_NEW_DEPENDENT } from '../actions/types';

const initialState = {
    dependents:[]
}

export default function(state = initialState, action){
    switch(action.type){
        case SUBMIT_NEW_DEPENDENT:
            return{
                ...state,
               newDep:{
                   ...state.newDep,
                   isSubmit:true
               }
            }
        default:
            return state;
    }
}
