import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import reducers from './reducers';

import { api } from './middleware/api';
import { authMiddleware } from './middleware/auth';
import { appMiddleware } from './middleware/app';
import { postsMiddleware } from './middleware/posts';
import { categoriesMiddleware } from './middleware/categories';
import { editorMiddleware } from './middleware/editor';
import { postMiddleware } from './middleware/post';

import { initApp } from './actions/app';

const store = createStore(
  reducers,
  composeWithDevTools(
    applyMiddleware(
      ...authMiddleware,
      api,
      ...appMiddleware,
      ...postMiddleware,
      ...postsMiddleware,
      ...categoriesMiddleware,
      ...editorMiddleware
    )
  )
);

store.dispatch(initApp());

export default store;
