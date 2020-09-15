import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

export default (ComposedComponent) => (props) => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  if (!isLoggedIn) {
    return <Redirect to={{ pathname: '/login' }} />;
  }
  return <ComposedComponent {...props} />;
};
