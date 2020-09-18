const prefix = '[post]';
export default prefix;
export const UPDATE_POSTPROP = `${prefix} Updating post property`;
export const PUBLISH_POST = `${prefix} Publish post`;
export const UPADTE_POST = `${prefix} Update post`;
export const GET_POST = `${prefix} Get single post by slug`;
export const CLEAR_POST = `${prefix} Clear post state`;
export const DELETE_POST = `${prefix} Delete single post by slug`;

export const updatePostProp = (prop) => ({
  type: UPDATE_POSTPROP,
  payload: prop,
});

export const publishPost = () => ({
  type: PUBLISH_POST,
});

export const updatePost = () => ({
  type: UPADTE_POST,
});

export const getPost = (slug) => ({
  type: GET_POST,
  payload: slug,
});

export const clearPost = () => ({
  type: CLEAR_POST,
});

export const deletePost = (slug) => ({
  type: DELETE_POST,
  payload: slug,
});
