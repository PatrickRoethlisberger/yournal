import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import moment from 'moment';
import { refreshToken } from '../redux/actions/auth';

export default (ComposedComponent) => (props) => {
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);

  if (!authState.isLoggedIn) {
    return <Redirect to={{ pathname: '/login' }} />;
  }
  if (moment(authState.token.expire).isBefore(moment().add(15, 'minutes'))) {
    dispatch(refreshToken());
  }
  return <ComposedComponent {...props} />;
};
