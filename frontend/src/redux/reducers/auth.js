/* eslint-disable no-case-declarations */
import {
  SAVE_AUTHTOKEN,
  SAVE_USER,
  UPDATE_AUTHTYPE,
  LOGOUT,
} from '../actions/auth';

const initialState = {
  isLoggedIn: false,
  types: [],
  token: {},
  user: {},
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_AUTHTYPE:
      return {
        ...state,
        types: action.payload,
      };

    case SAVE_AUTHTOKEN:
      return {
        ...state,
        isLoggedIn: true,
        token: action.payload,
      };

    case SAVE_USER:
      return {
        ...state,
        ...action.payload,
        isLoggedIn: true,
      };
    case LOGOUT:
      return { ...initialState };

    default:
      return state;
  }
}
