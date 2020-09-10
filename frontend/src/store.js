import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';

const Store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(thunk))
);

export default Store;
