import { combineReducers } from 'redux';
import auth from '../reducers/auth';
import ui from './ui';
import posts from './posts';

const reducers = combineReducers({
  auth,
  ui,
  posts,
});

export default reducers;
