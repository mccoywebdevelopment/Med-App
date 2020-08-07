import { UPDATE_FORM_OVERVIEW, SUBMIT_NEW_DEPENDENT } from '../actions/types';

const initialState = {
    newDep:{
        overview:{
            isValid:false,
            data:null,
        },
        rxsMedications:[{
            isValid:false,
            data:null
        }],
        notes:[{
            isValid:false,
            data:null
        }],

        isSubmit:false
    }
}

export default function(state = initialState, action){
    switch(action.type){
        case UPDATE_FORM_OVERVIEW:
            alert("update")
            return{
                ...state,
                newDep:{
                    ...state.newDep,
                    overview:{
                        isValid:action.payload.isValid,
                        data:action.payload.data
                    }
                }
            }
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
