import { combineReducers } from 'redux';
import AuthListReducer from './AuthListReducer';

const CombinedReducer = combineReducers({
  AuthList: AuthListReducer,
});

export default CombinedReducer;
