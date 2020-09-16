import { apiRequest, API_ERROR, API_SUCCESS } from '../actions/api';
import {
  getPosts,
  GET_POSTS,
  GET_POSTSDATES,
  SET_PAGE,
} from '../actions/posts';
import { hideSpinner, showNotification, showSpinner } from '../actions/ui';
import conf from '../../conf';
import { getUser } from '../actions/auth';

export const getPostsFlow = ({ dispatch, getState }) => (next) => (action) => {
  next(action);

  const state = getState();

  switch (action.type) {
    case GET_POSTS:
      const page = state.posts.currentPage;
      const limit = state.posts.pageSize;

      const requestUrl = `${conf.apiRoot}/posts?limit=${limit}&offset=${
        (page - 1) * limit
      }`;

      dispatch(
        apiRequest({
          body: null,
          method: 'GET',
          url: requestUrl,
          feature: GET_POSTS,
        })
      );
      dispatch(showSpinner({ feature: GET_POSTS }));
      break;

    case `${GET_POSTS} ${API_SUCCESS}`:
      dispatch(hideSpinner({ feature: GET_POSTS }));
      break;

    case `${GET_POSTS} ${API_ERROR}`:
      // Most probably failed due to invalid session
      dispatch(showNotification(getUser()));
      dispatch(hideSpinner({ feature: GET_POSTS }));
      break;
  }
};

export const getPostsDatesFlow = ({ dispatch }) => (next) => (action) => {
  next(action);

  switch (action.type) {
    case GET_POSTSDATES:
      const requestUrl = `${conf.apiRoot}/posts`;

      dispatch(
        apiRequest({
          body: null,
          method: 'GET',
          url: requestUrl,
          feature: GET_POSTSDATES,
        })
      );
      dispatch(showSpinner({ feature: GET_POSTSDATES }));
      break;

    case `${GET_POSTSDATES} ${API_SUCCESS}`:
      dispatch(hideSpinner({ feature: GET_POSTSDATES }));
      break;

    case `${GET_POSTSDATES} ${API_ERROR}`:
      // Most probably failed due to invalid session
      dispatch(showNotification(getUser()));
      dispatch(hideSpinner({ feature: GET_POSTSDATES }));
      break;
  }
};

export const setPageFlow = ({ dispatch }) => (next) => (action) => {
  next(action);

  switch (action.type) {
    case SET_PAGE:
      dispatch(getPosts());
      break;
  }
};

export const postsMiddleware = [getPostsFlow, getPostsDatesFlow, setPageFlow];
