import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import moment from 'moment';
import { refreshToken } from '../redux/actions/auth';
import { showNotification } from '../redux/actions/ui';

export default (ComposedComponent) => (props) => {
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);

  if (!authState.isLoggedIn) {
    return <Redirect to={{ pathname: '/login' }} />;
  }
  if (moment(authState.token.expire).isBefore(moment().add(55, 'minutes'))) {
    dispatch(showNotification('info', 'Token nearly expired'));
    dispatch(refreshToken());
  }
  return <ComposedComponent {...props} />;
};
