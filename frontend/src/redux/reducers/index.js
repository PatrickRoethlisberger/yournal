import { combineReducers } from 'redux';
import auth from '../reducers/auth';
import ui from './ui';

const reducers = combineReducers({
  auth,
  ui,
});

export default reducers;
