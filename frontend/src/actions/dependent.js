import { UPDATE_FORM_OVERVIEW, SUBMIT_NEW_DEPENDENT } from './types';

// CREATE MESSAGE
export const updateFormOverview = (isValid,data) => (dispatch) =>{
  dispatch({
    type: UPDATE_FORM_OVERVIEW,
    payload: {isValid,data}
  })
};

export const submitNewDependent = () => (dispatch) =>{
  dispatch({
    type: SUBMIT_NEW_DEPENDENT,
    payload:null
  })
};
