const prefix = '[ui]';
export default prefix;
export const GO_DARK = `${prefix} Set theme to dark`;
export const GO_LIGHT = `${prefix} Set theme to light`;
export const SHOW_SPINNER = `${prefix} show spinner`;
export const HIDE_SPINNER = `${prefix} hide spinner`;
export const SHOW_NOTIFICATION = `${prefix} show notification`;
export const HIDE_NOTIFICATION = `${prefix} hide notification`;

export const goDark = () => ({
  type: GO_DARK,
});
export const goLight = () => ({
  type: GO_LIGHT,
});

export const showSpinner = ({ feature } = {}, otherMeta = {}) => ({
  type: SHOW_SPINNER,
  payload: { feature, ...otherMeta },
});

export const hideSpinner = ({ feature } = {}, otherMeta = {}) => ({
  type: HIDE_SPINNER,
  payload: { feature, ...otherMeta },
});

export const showNotification = (severity, message) => ({
  type: SHOW_NOTIFICATION,
  payload: { severity, message },
});

export const hideNotification = () => ({
  type: HIDE_NOTIFICATION,
});
