import { Alert } from '@material-ui/lab';
import React from 'react';
import { Snackbar } from '@material-ui/core';
import Slide from '@material-ui/core/Slide';
import { useDispatch, useSelector } from 'react-redux';
import { hideNotification } from '../redux/actions/ui';

const SnackbarComp = () => {
  const dispatch = useDispatch();
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(hideNotification());
  };

  function TransitionLeft(props) {
    return <Slide {...props} direction="left" />;
  }
  const uiState = useSelector((state) => state.ui);
  return (
    <Snackbar
      open={uiState.showNotification}
      autoHideDuration={6000}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      TransitionComponent={TransitionLeft}
      onClose={handleClose}
    >
      <Alert
        variant="filled"
        severity={uiState.notification.severity}
        color={uiState.notification.severity}
        onClose={handleClose}
      >
        {uiState.notification.message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarComp;
