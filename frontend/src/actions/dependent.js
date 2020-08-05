import { UPDATE_FORM_OVERVIEW, SUBMIT_NEW_DEPENDENT } from './types';

// CREATE MESSAGE
export const updateFormOverview = (name,dob,groupID) => (dispatch) =>{
  dispatch({
    type: UPDATE_FORM_OVERVIEW,
    payload: {name,dob,groupID}
  })
};

export const submitNewDependent = () => (dispatch) =>{
  dispatch({
    type: SUBMIT_NEW_DEPENDENT,
    payload:null
  })
};
