import { hideSpinner, showNotification, showSpinner } from '../actions/ui';
import conf from '../../conf';
import { GET_POST, PUBLISH_POST, UPADTE_POST } from '../actions/post';
import { apiRequest, API_ERROR, API_SUCCESS } from '../actions/api';
import moment from 'moment';
import history from '../../history';
import { getPostDates } from '../actions/posts';

export const publishPostFlow = ({ dispatch, getState }) => (next) => (
  action
) => {
  next(action);
  const state = getState();

  switch (action.type) {
    case PUBLISH_POST:
      const requestUrl = `${conf.apiRoot}/posts`;

      const param = {
        title: state.post.title,
        coverImage: state.post.coverImage,
        category: state.post.category.name,
        body: state.post.body,
        pubDate: moment(state.post.pubDate).format('YYYY-MM-DD[T]hh:mm:ss[Z]'),
        isPrivate: true,
      };

      dispatch(
        apiRequest({
          body: param,
          method: 'POST',
          url: requestUrl,
          feature: PUBLISH_POST,
        })
      );
      dispatch(showSpinner({ feature: PUBLISH_POST }));
      break;

    case `${PUBLISH_POST} ${API_SUCCESS}`:
      dispatch(showNotification('success', 'Beitrag erfolgreich erstellt 📨'));
      dispatch(getPostDates());
      history.push(`/post/${action.payload.post.slug}`);
      dispatch(hideSpinner({ feature: PUBLISH_POST }));
      break;

    case `${PUBLISH_POST} ${API_ERROR}`:
      dispatch(hideSpinner({ feature: PUBLISH_POST }));
      break;
    default:
      break;
  }
};

export const updatePostFlow = ({ dispatch, getState }) => (next) => (
  action
) => {
  next(action);
  const state = getState();

  switch (action.type) {
    case UPADTE_POST:
      const requestUrl = `${conf.apiRoot}/posts/${state.post.slug}`;

      const param = {
        title: state.post.title,
        coverImage: state.post.coverImage,
        category: state.post.category.name,
        body: state.post.body,
        pubDate: moment(state.post.pubDate).format('YYYY-MM-DD[T]hh:mm:ss[Z]'),
        isPrivate: true,
      };

      dispatch(
        apiRequest({
          body: param,
          method: 'PUT',
          url: requestUrl,
          feature: UPADTE_POST,
        })
      );
      dispatch(showSpinner({ feature: UPADTE_POST }));
      break;

    case `${UPADTE_POST} ${API_SUCCESS}`:
      dispatch(showNotification('success', 'Beitrag erfolgreich bearbeitet'));
      dispatch(getPostDates());
      history.push(`/post/${action.payload.post.slug}`);
      dispatch(hideSpinner({ feature: UPADTE_POST }));
      break;

    case `${UPADTE_POST} ${API_ERROR}`:
      dispatch(hideSpinner({ feature: UPADTE_POST }));
      break;
    default:
      break;
  }
};

export const getPostFlow = ({ dispatch }) => (next) => (action) => {
  next(action);

  switch (action.type) {
    case GET_POST:
      const requestUrl = `${conf.apiRoot}/posts/${action.payload}`;

      dispatch(
        apiRequest({
          body: null,
          method: 'GET',
          url: requestUrl,
          feature: GET_POST,
        })
      );
      dispatch(showSpinner({ feature: GET_POST }));
      break;

    case `${GET_POST} ${API_SUCCESS}`:
      dispatch(hideSpinner({ feature: GET_POST }));
      break;

    case `${GET_POST} ${API_ERROR}`:
      dispatch(hideSpinner({ feature: GET_POST }));
      break;
    default:
      break;
  }
};

export const postMiddleware = [publishPostFlow, updatePostFlow, getPostFlow];
