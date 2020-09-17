const prefix = '[app]';
export default prefix;
export const GET_CATEGORIES = `${prefix} Getting categories`;

export const getCategories = () => ({
  type: GET_CATEGORIES,
});
