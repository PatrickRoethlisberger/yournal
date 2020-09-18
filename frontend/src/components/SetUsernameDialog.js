import React, { useState } from 'react';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@material-ui/core';
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

  // Show dialog when a user is logged in but doesn't have username assigned
  const showDialog = () => {
    if (authState.user.username === '' && authState.isLoggedIn) {
      return true;
    } else {
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username !== '') {
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
  );
};

export default SetUsernameDialog;
