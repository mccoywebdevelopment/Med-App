import { TOGGLE_POPUP } from '../actions/types';

const initialState = {
    component:null,
    title:""
};

export default function(state = initialState, action){
    switch(action.type){
        case TOGGLE_POPUP:
            return{
                ...state,
                component: action.payload.component,
                title: action.payload.title
            };
        default:
            return state;
    }
}