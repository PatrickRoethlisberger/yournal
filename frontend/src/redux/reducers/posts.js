import { API_SUCCESS } from '../actions/api';
import { GET_POSTS, GET_POSTSDATES, SET_PAGE } from '../actions/posts';
import moment from 'moment';

const initialState = {
  count: null,
  items: [],
  filter: {},
  currentPage: 1,
  pageSize: 10,
  dateCount: {},
};

export default function postsReducer(state = initialState, action) {
  switch (action.type) {
    case `${GET_POSTS} ${API_SUCCESS}`:
      return {
        ...state,
        count: action.payload.postCount,
        items: action.payload.posts,
      };
    case SET_PAGE:
      return {
        ...state,
        currentPage: action.payload,
      };
    case `${GET_POSTSDATES} ${API_SUCCESS}`:
      // Count each unique date from the API response in an object
      var counts = {};
      action.payload.posts.forEach(function (x) {
        var xDate = moment(new Date(x.pubDate)).format('YYYY-MM-DD');
        counts[xDate] = (counts[xDate] || 0) + 1;
      });

      return {
        ...state,
        dateCount: counts,
      };
    default:
      return state;
  }
}
