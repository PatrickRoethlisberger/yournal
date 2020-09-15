import AUTH, {
  saveAuthToken,
  saveAuthTokenToLocalStorage,
  getUser,
  saveUser,
  logout,
  LOGOUT,
  GET_AUTHTYPE,
  POST_AUTHPARAMS,
  SAVE_AUTHTOKEN_LOCALSTORAGE,
  GET_USER,
} from '../actions/auth';
import { showSpinner, hideSpinner, showNotification } from '../actions/ui';
import { apiRequest, API_SUCCESS, API_ERROR } from '../actions/api';
import conf from '../../conf';
import { updateAuthType } from '../actions/auth';
import history from '../../history';

export const getAuthtypeFlow = ({ dispatch }) => (next) => (action) => {
  console.log(action.type);
  next(action);

  let requestUrl;
  switch (action.type) {
    case GET_AUTHTYPE:
      requestUrl = `${conf.apiRoot}/auth`;

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
      console.log(action.payload);
      dispatch(updateAuthType(action.payload));
      dispatch(hideSpinner({ feature: AUTH }, { date: action.meta.date }));
      break;

    case `${GET_AUTHTYPE} ${API_ERROR}`:
      console.log(action.payload);
      dispatch(showNotification('error', 'Login aktuell nicht möglich 🔥'));
      dispatch(hideSpinner({ feature: AUTH }));
      break;
  }
};
export const postAuthParamsFlow = ({ dispatch }) => (next) => (action) => {
  console.log(action.type);
  next(action);
  let requestUrl;
  switch (action.type) {
    case POST_AUTHPARAMS:
      requestUrl = `${conf.apiRoot}/auth`;
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
      console.log(action.payload);
      console.log('hi');
      dispatch(saveAuthTokenToLocalStorage(action.payload));
      dispatch(showNotification('success', 'Login erfolgreich 🎉'));
      break;

    case `${POST_AUTHPARAMS} ${API_ERROR}`:
      console.log(action.payload);
      dispatch(hideSpinner({ feature: AUTH }));
      dispatch(
        showNotification('error', 'Beim Login ist ein Fehler aufgetreten 💥')
      );
      history.push('/login');
      break;
  }
};
export const saveToLocalStorageFlow = ({ dispatch }) => (next) => (action) => {
  console.log(action.type);
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
  console.log(action.type);
  console.log(action);
  next(action);
  let requestUrl;
  switch (action.type) {
    case GET_USER:
      requestUrl = `${conf.apiRoot}/users`;
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
      console.log('jsa');
      console.log(action.payload);
      if (action.payload.user.username != '') {
        dispatch(saveUser(action.payload));
      } else {
        dispatch(saveUser(action.payload));
        // TODO: Add username setter thingi
        dispatch(showNotification('error', 'User doesnt have  usernaem'));
      }
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
export const logoutFlow = () => (next) => (action) => {
  console.log(action.type);
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
  logoutFlow,
];
