import { TOGGLE_POPUP } from './types';

// CREATE MESSAGE
export const togglePopUp = (title,component) => {
  return {
    type: TOGGLE_POPUP,
    payload: {title,component},
  };
};
