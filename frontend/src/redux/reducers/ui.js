import {
  GO_DARK,
  GO_LIGHT,
  SHOW_SPINNER,
  HIDE_SPINNER,
  SHOW_NOTIFICATION,
  HIDE_NOTIFICATION,
} from '../actions/ui';

const initUi = {
  paletteType: 'dark',
  pending: false,
  pendingFeatures: {},
  showNotification: false,
  notification: {},
};

export default function uiReducer(state = initUi, action) {
  switch (action.type) {
    case GO_DARK:
      localStorage.setItem('theme', 'dark');
      return { ...state, paletteType: 'dark' };
    case GO_LIGHT:
      localStorage.setItem('theme', 'light');
      return { ...state, paletteType: 'light' };

    case SHOW_SPINNER:
      return {
        ...state,
        pending: true,
        pendingFeatures: {
          ...state.pendingFeatures,
          [`${action.payload.feature}${
            action.payload.date ? action.payload.date : ''
          }`]: true,
        },
      };

    case HIDE_SPINNER:
      if (!action.payload.feature) {
        return {
          ...state,
          pending: false,
          pendingFeatures: {},
        };
      }

      const pendingFeatures = {
        ...state.pendingFeatures,
        [`${action.payload.feature}${
          action.payload.date ? action.payload.date : ''
        }`]: false,
      };

      // Remove all properties of not pending features
      for (let key in pendingFeatures) {
        if (!pendingFeatures[key]) {
          delete pendingFeatures[key];
        }
      }

      return {
        ...state,
        pending: !!Object.keys(pendingFeatures).length,
        pendingFeatures,
      };

    case SHOW_NOTIFICATION:
      return {
        ...state,
        showNotification: true,
        notification: {
          severity: action.payload.severity,
          message: action.payload.message,
        },
      };

    case HIDE_NOTIFICATION:
      return {
        ...state,
        showNotification: false,
        notification: {},
      };

    default:
      return state;
  }
}
