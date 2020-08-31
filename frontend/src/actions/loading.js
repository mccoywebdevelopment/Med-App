import { TOGGLE_LOADING } from './types';

// CREATE MESSAGE
export const toggleLoading = (value) => {
  return {
    type: TOGGLE_LOADING,
    payload: value,
  };
};
