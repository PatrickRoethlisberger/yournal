const DefaultState = {
  loading: false,
  token: [],
  errorMsg: '',
};

const AuthPostReducer = (state = DefaultState, action) => {
  switch (action.type) {
    case 'AUTH_POST_LOADING':
      return {
        ...state,
        loading: true,
        errorMsg: '',
      };
    case 'AUTH_POST_FAIL':
      return {
        ...state,
        loading: false,
        errorMsg: action.payload,
      };
    case 'AUTH_POST_SUCCESS':
      return {
        ...state,
        loading: false,
        token: action.payload,
        errorMsg: '',
      };
    default:
      return state;
  }
};

export default AuthPostReducer;
