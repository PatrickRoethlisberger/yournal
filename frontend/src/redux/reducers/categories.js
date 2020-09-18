import { API_SUCCESS } from '../actions/api';
import { GET_CATEGORIES } from '../actions/categories';

const initialState = {
  items: [],
};

export default function categoriesReducer(state = initialState, action) {
  switch (action.type) {
    case `${GET_CATEGORIES} ${API_SUCCESS}`:
      return {
        ...state,
        items: action.payload.categories,
      };
    default:
      return state;
  }
}
