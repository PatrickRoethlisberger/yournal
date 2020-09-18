const prefix = '[app]';
export default prefix;
export const INIT_APP = `${prefix} Initialize`;
export const INIT_SESSION = `${prefix} Initialize user session`;

export const initApp = () => ({
  type: INIT_APP,
});

export const initSession = () => ({
  type: INIT_SESSION,
});
