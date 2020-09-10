import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetAuthList } from '../actions/authActions';
import _ from 'lodash';

const Auth = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.AuthList);
  React.useEffect(() => {
    dispatch(GetAuthList());
  }, []);

  const ShowData = () => {
    if (!_.isEmpty(authState.data)) {
      return (
        <div className={'list-wrapper'}>
          <div className={'pokemon-item'}>
            <a href={authState.data.oAuthMethods.oAuthLink}>
              {authState.data.oAuthMethods.oAuthName}
            </a>
          </div>
        </div>
      );
    }

    if (authState.loading) {
      return <p>Loading...</p>;
    }

    if (authState.errorMsg !== '') {
      return <p>{authState.errorMsg.message}</p>;
    }

    return <p>error getting auth types</p>;
  };

  return (
    <div className={'poke'}>
      <h1>Login</h1>
      <ShowData />
    </div>
  );
};

export default Auth;
