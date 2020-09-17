import { INIT_APP } from '../actions/app';
import { saveAuthToken, getUser } from '../actions/auth';
import { goDark, goLight, hideSpinner } from '../actions/ui';

export const appInitFlow = ({ dispatch, getState }) => (next) => (action) => {
  next(action);

  if (action.type === INIT_APP) {
    // Dark mode management if set from local storage - otherwise use mediaquery
    // Default: light
    const theme = localStorage.getItem('theme');
    if (
      theme !== 'light' &&
      matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      dispatch(goDark());
    } else if (
      theme !== 'dark' &&
      matchMedia('(prefers-color-scheme: light)').matches
    ) {
      dispatch(goLight());
    }

    // Stop all spinners (in case there was a bug or something and the app was reloaded while pending)
    dispatch(hideSpinner());

    const token = JSON.parse(localStorage.getItem('jwt'));
    if (token) {
      dispatch(saveAuthToken(token));
      dispatch(getUser());
    }
  }
};

export const appMiddleware = [appInitFlow];
