import { Alert } from '@material-ui/lab';
import React, { useState } from 'react';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  TextField,
} from '@material-ui/core';
import Slide from '@material-ui/core/Slide';
import { useDispatch, useSelector } from 'react-redux';
import { showNotification } from '../redux/actions/ui';
import { postUsername, POST_USERNAME } from '../redux/actions/auth';

const SetUsernameDialog = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const authState = useSelector((state) => state.auth);
  const loading = useSelector(
    (state) => state.ui.pendingFeatures[POST_USERNAME]
  );

  const showDialog = () => {
    if (authState.user.username == '' && authState.isLoggedIn) {
      return true;
    } else {
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username != '') {
      dispatch(postUsername(username));
    } else {
      dispatch(
        showNotification('warning', 'Der Benutzername kann nicht leer sein 🔍')
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Dialog
        open={showDialog()}
        disableBackdropClick={true}
        disableEscapeKeyDown={true}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Besten Dank</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Vielen Dank dass Sie sich für yournal angemeldet haben. Bitte
            setzten Sie ihren gewünschten Benutzernamen.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Benutzername"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          {loading ? (
            <CircularProgress />
          ) : (
            <Button onClick={(e) => handleSubmit(e)} color="primary">
              Ok
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </form>
    // <Snackbar
    //   open={uiState.showNotification}
    //   autoHideDuration={6000}
    //   anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    //   TransitionComponent={TransitionLeft}
    //   onClose={handleClose}
    // >
    //   <Alert
    //     variant="filled"
    //     severity={uiState.notification.severity}
    //     color={uiState.notification.severity}
    //     onClose={handleClose}
    //   >
    //     {uiState.notification.message}
    //   </Alert>
    // </Snackbar>
  );
};

export default SetUsernameDialog;
