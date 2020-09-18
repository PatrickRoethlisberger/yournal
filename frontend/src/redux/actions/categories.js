const prefix = '[app]';
export default prefix;
export const GET_CATEGORIES = `${prefix} Getting categories`;
export const CREATE_CATEGORY = `${prefix} Creating category`;

export const getCategories = () => ({
  type: GET_CATEGORIES,
});

export const createCategory = (name) => ({
  type: CREATE_CATEGORY,
  payload: name,
});
