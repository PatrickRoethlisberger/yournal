const prefix = '[posts]';
export default prefix;
export const GET_POSTS = `${prefix} Getting posts from backend`;
export const GET_POSTSDATES = `${prefix} Getting posts dates from backend`;
export const SET_PAGE = `${prefix} Setting current Page`;

export const getPosts = () => ({
  type: GET_POSTS,
});

export const getPostDates = () => ({
  type: GET_POSTSDATES,
});

export const setPage = (page) => ({
  type: SET_PAGE,
  payload: page,
});
