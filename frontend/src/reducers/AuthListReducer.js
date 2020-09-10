const DefaultState = {
  loading: false,
  data: [],
  errorMsg: '',
};

const AuthListReducer = (state = DefaultState, action) => {
  switch (action.type) {
    case 'AUTH_LIST_LOADING':
      return {
        ...state,
        loading: true,
        errorMsg: '',
      };
    case 'AUTH_LIST_FAIL':
      return {
        ...state,
        loading: false,
        errorMsg: action.payload,
      };
    case 'AUTH_LIST_SUCCESS':
      return {
        ...state,
        loading: false,
        data: action.payload,
        errorMsg: '',
      };
    default:
      return state;
  }
};

export default AuthListReducer;
