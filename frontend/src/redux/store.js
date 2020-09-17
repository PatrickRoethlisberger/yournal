import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import reducers from './reducers';

import { api } from './middleware/api';
import { authMiddleware } from './middleware/auth';
import { appMiddleware } from './middleware/app';
import { postsMiddleware } from './middleware/posts';
import { categoriesMiddleware } from './middleware/categories';

import { initApp } from './actions/app';

const store = createStore(
  reducers,
  composeWithDevTools(
    applyMiddleware(
      ...authMiddleware,
      api,
      ...appMiddleware,
      ...postsMiddleware,
      ...categoriesMiddleware
    )
  )
);

store.dispatch(initApp());

export default store;
