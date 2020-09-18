import { API_SUCCESS } from '../actions/api';
import { CLEAR_POST, GET_POST, UPDATE_POSTPROP } from '../actions/post';
import moment from 'moment';

const initialState = {
  slug: null,
  coverImage: '',
  title: '',
  category: '',
  pubDate: '',
  body: '',
};

export default function postReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_POSTPROP:
      return {
        ...state,
        ...action.payload,
      };
    case `${GET_POST} ${API_SUCCESS}`:
      return {
        ...state,
        slug: action.payload.post.slug,
        coverImage: action.payload.post.coverImage,
        title: action.payload.post.title,
        category: { name: action.payload.post.category },
        pubDate: moment(action.payload.post.pubDate),
        body: action.payload.post.body,
      };
    case CLEAR_POST:
      return {
        ...initialState,
      };
    default:
      return state;
  }
}
