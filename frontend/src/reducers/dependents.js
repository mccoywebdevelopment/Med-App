import { UPDATE_FORM_OVERVIEW, SUBMIT_NEW_DEPENDENT } from '../actions/types';

const initialState = {
    newDep:{
        overview:{
            name:null,
            dob:null,
            groupID:null,

            nameErrorMsg:null,
            dobErrorMsg:null,
            groupIDErrorMsg:null,
        },
        medications:[{
            name:null,
            rxsNumber:null,
            datePrescribed:null,
            doctorNumber:null,
            doctorName:null,
            reason:null,
            instructions:null,
            endDate:null,
            dosageQuantity:null,
            whenToTake:null,

            nameErrorMsg:null,
            datePrescribedErrorMsg:null,
            doctorNumberErrorMsg:null,
            doctorNameErrorMsg:null,
            reasonErrorMsg:null,
            instructionsErrorMsg:null,
            endDateErrorMsg:null,
            dosageQuantityErrorMsg:null,
            whenToTakeErrorMsg:null,
        }],
        isSubmit:false
    }
}

export default function(state = initialState, action){
    switch(action.type){
        case UPDATE_FORM_OVERVIEW:
            return{
                ...state,
                newDep:{
                    ...state,
                    overview:{
                        name:action.payload.name,
                        dob:action.payload.dob,
                        groupID:action.payload.groupID
                    }
                }
            }
        case SUBMIT_NEW_DEPENDENT:
            return{
                ...state,
               newDep:{
                   ...state,
                   isSubmit:true
               }
            }
        default:
            return state;
    }
}
