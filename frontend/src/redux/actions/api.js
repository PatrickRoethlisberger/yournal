const prefix = '[api]';
export default prefix;
export const API_REQUEST = `${prefix} API Request`;
export const API_SUCCESS = `${prefix} API Success`;
export const API_ERROR = `${prefix} API Error`;

export const apiRequest = ({ method, url, body, feature }, otherMeta = {}) => {
  return {
    type: `${feature} ${API_REQUEST}`,
    payload: body,
    meta: { method, url, feature, ...otherMeta },
  };
};

export const apiSuccess = ({ data, feature }, otherMeta = {}) => ({
  type: `${feature} ${API_SUCCESS}`,
  payload: data,
  meta: { feature, ...otherMeta },
});

export const apiError = ({ error, feature }, otherMeta = {}) => ({
  type: `${feature} ${API_ERROR}`,
  payload: error,
  meta: { feature, ...otherMeta },
});
