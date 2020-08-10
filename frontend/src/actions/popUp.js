import { TOGGLE_POPUP } from './types';

// CREATE MESSAGE
export const togglePopUp = (title,component,width) => {
  return {
    type: TOGGLE_POPUP,
    payload: {title,component,width},
  };
};
