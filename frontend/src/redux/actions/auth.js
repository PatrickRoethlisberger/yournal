const prefix = '[auth]';
export default prefix;
export const GET_AUTHTYPE = `${prefix} Getting auth type`;
export const UPDATE_AUTHTYPE = `${prefix} Update auth type with fetched data`;
export const POST_AUTHPARAMS = `${prefix} Posting parameters recieved by oAuth provider`;
export const SAVE_AUTHTOKEN_LOCALSTORAGE = `${prefix} Saving token into local storage`;
export const SAVE_AUTHTOKEN = `${prefix} Saving token into state`;
export const GET_USER = `${prefix} Populate user object`;
export const SAVE_USER = `${prefix} Saving user object into state`;
export const POST_USERNAME = `${prefix} Post username set by User`;
export const LOGOUT = `${prefix} Logout`;

export const getAuthType = () => ({
  type: GET_AUTHTYPE,
});

export const updateAuthType = (type) => ({
  type: UPDATE_AUTHTYPE,
  payload: type,
});

export const postAuthParams = (oAuthState, oAuthCode) => ({
  type: POST_AUTHPARAMS,
  payload: {
    oAuthState,
    oAuthCode,
  },
});

export const saveAuthTokenToLocalStorage = (payload) => ({
  type: SAVE_AUTHTOKEN_LOCALSTORAGE,
  payload: payload,
});

export const saveAuthToken = (payload) => ({
  type: SAVE_AUTHTOKEN,
  payload: payload,
});

export const getUser = () => ({
  type: GET_USER,
});

export const saveUser = (payload) => ({
  type: SAVE_USER,
  payload: payload,
});

export const postUsername = (payload) => ({
  type: POST_USERNAME,
  payload: payload,
});

export const logout = () => ({
  type: LOGOUT,
});
