import AUTH, {
  saveAuthToken,
  saveAuthTokenToLocalStorage,
  getUser,
  saveUser,
  logout,
  GET_AUTHTYPE,
  POST_AUTHPARAMS,
  SAVE_AUTHTOKEN_LOCALSTORAGE,
  GET_USER,
  POST_USERNAME,
  LOGOUT,
} from '../actions/auth';
import { showSpinner, hideSpinner, showNotification } from '../actions/ui';
import { apiRequest, API_SUCCESS, API_ERROR } from '../actions/api';
import conf from '../../conf';
import { updateAuthType } from '../actions/auth';
import history from '../../history';

export const getAuthtypeFlow = ({ dispatch }) => (next) => (action) => {
  next(action);

  switch (action.type) {
    case GET_AUTHTYPE:
      const requestUrl = `${conf.apiRoot}/auth`;

      dispatch(
        apiRequest({
          body: null,
          method: 'GET',
          url: requestUrl,
          feature: GET_AUTHTYPE,
        })
      );
      dispatch(showSpinner({ feature: AUTH }));
      break;

    case `${GET_AUTHTYPE} ${API_SUCCESS}`:
      dispatch(updateAuthType(action.payload));
      dispatch(hideSpinner({ feature: AUTH }, { date: action.meta.date }));
      break;

    case `${GET_AUTHTYPE} ${API_ERROR}`:
      dispatch(showNotification('error', 'Login aktuell nicht möglich 🔥'));
      dispatch(hideSpinner({ feature: AUTH }));
      break;
  }
};
export const postAuthParamsFlow = ({ dispatch }) => (next) => (action) => {
  next(action);

  switch (action.type) {
    case POST_AUTHPARAMS:
      const requestUrl = `${conf.apiRoot}/auth`;
      const param = {
        code: action.payload.oAuthCode,
        state: action.payload.oAuthState,
        oAuthType: 'Google',
      };

      dispatch(
        apiRequest({
          body: param,
          method: 'POST',
          url: requestUrl,
          feature: POST_AUTHPARAMS,
        })
      );
      dispatch(showSpinner({ feature: AUTH }));
      history.push('/login');
      break;
    case `${POST_AUTHPARAMS} ${API_SUCCESS}`:
      dispatch(saveAuthTokenToLocalStorage(action.payload));
      dispatch(showNotification('success', 'Login erfolgreich 🎉'));
      break;

    case `${POST_AUTHPARAMS} ${API_ERROR}`:
      dispatch(hideSpinner({ feature: AUTH }));
      dispatch(
        showNotification('error', 'Beim Login ist ein Fehler aufgetreten 💥')
      );
      history.push('/login');
      break;
  }
};
export const saveToLocalStorageFlow = ({ dispatch }) => (next) => (action) => {
  next(action);

  switch (action.type) {
    case SAVE_AUTHTOKEN_LOCALSTORAGE:
      localStorage.setItem('jwt', JSON.stringify({ ...action.payload }));
      dispatch(saveAuthToken(action.payload));
      dispatch(getUser());
      break;
  }
};
export const getUserFlow = ({ dispatch }) => (next) => (action) => {
  next(action);

  switch (action.type) {
    case GET_USER:
      const requestUrl = `${conf.apiRoot}/users`;
      dispatch(
        apiRequest({
          body: null,
          method: 'GET',
          url: requestUrl,
          feature: GET_USER,
        })
      );
      break;
    case `${GET_USER} ${API_SUCCESS}`:
      dispatch(saveUser(action.payload));
      break;

    case `${GET_USER} ${API_ERROR}`:
      dispatch(hideSpinner({ feature: AUTH }));
      dispatch(logout());
      dispatch(
        showNotification(
          'warning',
          'Ihre Anmeldung ist leider abgelaufen - bitte erneut einloggen 🔐'
        )
      );
      history.push('/login');
      break;
  }
};

export const postUsernameFlow = ({ dispatch }) => (next) => (action) => {
  next(action);

  switch (action.type) {
    case POST_USERNAME:
      const requestUrl = `${conf.apiRoot}/users`;
      const param = {
        username: action.payload,
      };

      dispatch(showSpinner({ feature: POST_USERNAME }));
      dispatch(
        apiRequest({
          body: param,
          method: 'PUT',
          url: requestUrl,
          feature: POST_USERNAME,
        })
      );
      break;
    case `${POST_USERNAME} ${API_SUCCESS}`:
      dispatch(saveUser(action.payload));
      dispatch(hideSpinner({ feature: POST_USERNAME }));
      break;

    case `${POST_USERNAME} ${API_ERROR}`:
      dispatch(hideSpinner({ feature: POST_USERNAME }));
      dispatch(
        showNotification(
          'warning',
          'Dieser Benutzername ist bereits vergeben - bitte versuchen Sie es erneut'
        )
      );
      break;
  }
};

export const logoutFlow = () => (next) => (action) => {
  next(action);

  switch (action.type) {
    case LOGOUT:
      localStorage.removeItem('jwt');
      history.push('/login');
      break;
  }
};

export const authMiddleware = [
  getAuthtypeFlow,
  postAuthParamsFlow,
  saveToLocalStorageFlow,
  getUserFlow,
  postUsernameFlow,
  logoutFlow,
];
