import { hideSpinner, showSpinner } from '../actions/ui';
import conf from '../../conf';
import {
  CREATE_CATEGORY,
  getCategories,
  GET_CATEGORIES,
} from '../actions/categories';
import { apiRequest, API_ERROR, API_SUCCESS } from '../actions/api';

export const getCategoriesFlow = ({ dispatch }) => (next) => (action) => {
  next(action);

  switch (action.type) {
    case GET_CATEGORIES:
      const requestUrl = `${conf.apiRoot}/category`;

      dispatch(
        apiRequest({
          body: null,
          method: 'GET',
          url: requestUrl,
          feature: GET_CATEGORIES,
        })
      );
      dispatch(showSpinner({ feature: GET_CATEGORIES }));
      break;

    case `${GET_CATEGORIES} ${API_SUCCESS}`:
      dispatch(hideSpinner({ feature: GET_CATEGORIES }));
      break;

    case `${GET_CATEGORIES} ${API_ERROR}`:
      dispatch(hideSpinner({ feature: GET_CATEGORIES }));
      break;
    default:
      break;
  }
};

export const createCategoryFlow = ({ dispatch }) => (next) => (action) => {
  next(action);

  switch (action.type) {
    case CREATE_CATEGORY:
      const requestUrl = `${conf.apiRoot}/category`;

      const param = {
        name: action.payload,
      };

      dispatch(
        apiRequest({
          body: param,
          method: 'POST',
          url: requestUrl,
          feature: CREATE_CATEGORY,
        })
      );
      dispatch(getCategories());
      dispatch(showSpinner({ feature: CREATE_CATEGORY }));
      break;

    case `${CREATE_CATEGORY} ${API_SUCCESS}`:
      dispatch(hideSpinner({ feature: CREATE_CATEGORY }));
      break;

    case `${CREATE_CATEGORY} ${API_ERROR}`:
      dispatch(hideSpinner({ feature: CREATE_CATEGORY }));
      break;
    default:
      break;
  }
};

export const categoriesMiddleware = [getCategoriesFlow, createCategoryFlow];
