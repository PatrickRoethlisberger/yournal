import { apiRequest, API_ERROR, API_SUCCESS } from '../actions/api';
import { GET_POSTS, GET_POSTSDATES } from '../actions/post';
import { hideSpinner, showNotification, showSpinner } from '../actions/ui';
import conf from '../../conf';

export const getPostsFlow = ({ dispatch, getState }) => (next) => (action) => {
  next(action);

  const state = getState();

  let requestUrl;
  switch (action.type) {
    case GET_POSTS:
      const page = state.posts.currentPage;
      const limit = state.posts.pageSize;
      const requestUrl = `${conf.apiRoot}/posts`;

      // URL wenn Marc Pagesize gefixt hat
      // const requestUrl = `${
      //   conf.apiRoot
      // }/posts?limit=${limit}&offset=${(page - 1) * limit}`;

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
      dispatch(
        showNotification(
          'error',
          'Leider konnten keine Posts gefunden werden - versuchen Sie es später erneut ⏳'
        )
      );
      dispatch(hideSpinner({ feature: GET_POSTS }));
      break;
  }
};

export const getPostsDatesFlow = ({ dispatch, getState }) => (next) => (
  action
) => {
  next(action);

  let requestUrl;
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
      dispatch(
        showNotification(
          'error',
          'Leider konnten keine Posts gefunden werden - versuchen Sie es später erneut ⏳'
        )
      );
      dispatch(hideSpinner({ feature: GET_POSTSDATES }));
      break;
  }
};

export const postsMiddleware = [getPostsFlow, getPostsDatesFlow];
