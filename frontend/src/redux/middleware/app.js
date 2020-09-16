import { INIT_APP } from '../actions/app';
import { saveAuthToken, getUser } from '../actions/auth';
import { goDark, goLight, hideSpinner } from '../actions/ui';

export const appInitFlow = ({ dispatch, getState }) => (next) => (action) => {
  next(action);

  if (action.type === INIT_APP) {
    // Dark mode management (from system settings)
    if (matchMedia('(prefers-color-scheme: dark)').matches) {
      dispatch(goDark());
    } else {
      dispatch(goLight());
    }
    matchMedia('(prefers-color-scheme: dark)').addEventListener(
      'change',
      (evt) => {
        let state = getState();
        if (!state.ui.manualThemeSet) {
          if (evt.matches) {
            dispatch(goDark());
          } else {
            dispatch(goLight());
          }
        }
      }
    );

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
