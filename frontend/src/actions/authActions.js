import axios from 'axios';

export const GetAuthList = () => async (dispatch) => {
  try {
    dispatch({
      type: 'AUTH_LIST_LOADING',
    });

    const res = await axios.get('https://api.yournal.tk/v1/auth');

    dispatch({
      type: 'AUTH_LIST_SUCCESS',
      payload: res.data,
    });
  } catch (e) {
    dispatch({
      type: 'AUTH_LIST_FAIL',
      payload: e,
    });
  }
};

export const PostAuthCredentials = () => async (dispatch) => {
  try {
    dispatch({
      type: 'AUTH_POST_LOADING',
    });

    const res = await axios.post('https://api.yournal.tk/v1/auth');

    dispatch({
      type: 'AUTH_POST_SUCCESS',
      payload: res.data,
    });
  } catch (e) {
    dispatch({
      type: 'AUTH_POST_FAIL',
      payload: e,
    });
  }
};
