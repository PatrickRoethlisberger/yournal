import fetch from 'node-fetch';
import { API_REQUEST, apiSuccess, apiError } from '../actions/api';

function handleResponse(response) {
  const contentType = response.headers.get('content-type');

  if (response.status === 401) throw new Error('Request was not authorized.');

  if (contentType === null) return new Promise(() => null);
  else if (contentType.startsWith('application/json;')) {
    return response.json();
  } else {
    return response.text();
  }
}

// this middleware cares only for API calls
export const api = ({ dispatch, getState }) => (next) => (action) => {
  if (action.type.includes(API_REQUEST)) {
    const { method, url, feature, ...other } = action.meta;
    const state = getState();

    const requestParam = {
      ...(method === 'FILE' ? { method: 'POST' } : { method }),
      ...(method === 'POST' || method === 'PUT'
        ? { body: JSON.stringify(action.payload) }
        : method === 'FILE'
        ? {
            body: action.payload,
          }
        : {}),
      headers: {
        ...(state.auth.isLoggedIn
          ? {
              Authorization: `Bearer ${state.auth.token.token}`,
            }
          : {}),
        ...(method === 'POST' || method === 'PUT'
          ? { 'Content-Type': 'application/json' }
          : {}),
      },
    };

    fetch(url, requestParam)
      .then((response) => handleResponse(response))
      .then((data) => {
        dispatch(apiSuccess({ data, feature }, other));
      })
      .catch((error) => {
        dispatch(apiError({ error, feature }, other));
      });
  }
  return next(action);
};
