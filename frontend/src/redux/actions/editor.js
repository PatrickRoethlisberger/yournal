const prefix = '[editor]';
export default prefix;
export const POST_IMAGE = `${prefix} Upload Image`;

export const postImage = (image) => ({
  type: POST_IMAGE,
  payload: image,
});
