import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/actions/auth';

const MenuBar = () => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };
  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" color="inherit" noWrap>
          Yournal
        </Typography>
        <Button onClick={handleLogout}>Logout</Button>
      </Toolbar>
    </AppBar>
  );
};

export default MenuBar;
