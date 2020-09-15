import { INIT_APP, INIT_SESSION, initSession } from '../actions/app';
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

    // // If the user is already logged in
    // let state = getState();
    // const isLoggedIn = state.auth.isLoggedIn;
    // if (isLoggedIn) {
    //   if (moment().isAfter(moment(state.auth.token.expires_at))) {
    //     dispatch(refreshToken());
    //   } else {
    //     dispatch(initSession());
    //   }
    // }
  }
};

export const sessionInitFlow = ({ dispatch, getState }) => (next) => (
  action
) => {
  next(action);

  if (action.type === INIT_SESSION) {
    // let state = getState();
    // if (!state.auth.isLoggedIn) {
    //   console.log('ERROR : User not yet logged in');
    // }
    // // Set inital working days if none are set.
    // if (!Object.keys(state.whours.days).length) {
    //   for (let i = 0; i <= 4; i++) {
    //     dispatch(addAM(i));
    //     dispatch(addPM(i));
    //   }
    // }
    // // If the current month is not yet populated, we need to populate it
    // const { month } = state;
    // if (!month.length) {
    //   dispatch(populateMonth());
    // }
    // // Now that the month is populatedm we now want to load the time
    // // entries for the current month.
    // // That way they are laready loaded when the caledar is displayed.
    // // Next time the entries are loaded is when the current month is
    // // changed ==> month middlware with NEXT_MONTH & PREV_MONTH actions
    // dispatch(fetchEntries());
  }
};

export const appMiddleware = [appInitFlow, sessionInitFlow];
