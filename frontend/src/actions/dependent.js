import { TOGGLE_LOADING } from './types';

// CREATE MESSAGE
export const toggleLoading = () => {
  return {
    type: TOGGLE_LOADING,
    payload: null,
  };
};
