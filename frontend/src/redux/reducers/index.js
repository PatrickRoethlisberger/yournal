import { combineReducers } from 'redux';
import auth from '../reducers/auth';
import ui from './ui';
import post from './post';
import posts from './posts';
import categories from './categories';

const reducers = combineReducers({
  auth,
  ui,
  post,
  posts,
  categories,
});

export default reducers;
