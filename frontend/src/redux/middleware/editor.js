import { hideSpinner, showNotification, showSpinner } from '../actions/ui';
import conf from '../../conf';
import { POST_IMAGE } from '../actions/editor';
import { updatePostProp } from '../actions/post';
import { apiRequest, API_ERROR, API_SUCCESS } from '../actions/api';

export const postImageFlow = ({ dispatch, getState }) => (next) => (action) => {
  next(action);

  switch (action.type) {
    case POST_IMAGE:
      const requestUrl = `${conf.apiRoot}/assets`;
      dispatch(showSpinner(POST_IMAGE));

      const fd = new FormData();
      fd.append('file', action.payload);

      dispatch(
        apiRequest({
          body: fd,
          method: 'FILE',
          url: requestUrl,
          feature: POST_IMAGE,
        })
      );
      break;
    case `${POST_IMAGE} ${API_SUCCESS}`:
      dispatch(hideSpinner(POST_IMAGE));
      dispatch(
        updatePostProp({ coverImage: `https://${action.payload.filepath} ` })
      );
      break;
    case `${POST_IMAGE} ${API_ERROR}`:
      dispatch(hideSpinner(POST_IMAGE));
      dispatch(
        showNotification(
          'warning',
          'Fehler beim Hochladen des Bildes 📷 Maximalgrösse 25MB'
        )
      );
      break;
    default:
      break;
  }
};

export const editorMiddleware = [postImageFlow];
