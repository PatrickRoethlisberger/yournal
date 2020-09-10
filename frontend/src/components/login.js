import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { GetAuthList } from '../actions/authActions';
import _ from 'lodash';
import Axios from 'axios';

const Login = () => {
  const search = useLocation().search;
  const oAuthState = new URLSearchParams(search).get('state');
  const oAuthCode = new URLSearchParams(search).get('code');
  if (oAuthCode != null && oAuthState != null) {
    const param = {
      code: oAuthCode,
      state: oAuthState,
      oAuthType: 'Google',
    };
    Axios.post('https://api.yournal.tk/v1/auth/', { ...param }).then((res) => {
      console.log(res);
      console.log(res.data);
    });
  }
  return (
    <div>
      <h1>AuthLogin</h1>
      {oAuthCode}
      {oAuthState}
    </div>
  );
};

export default Login;
