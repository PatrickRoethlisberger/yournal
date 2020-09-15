import React from 'react';
import {
  Button,
  CircularProgress,
  Grid,
  makeStyles,
  Paper,
  Typography,
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useLocation } from 'react-router-dom';
import _ from 'lodash';

import AUTH, { getAuthType, postAuthParams } from '../redux/actions/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

const Login = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const loading = useSelector((state) => state.ui.pendingFeatures[AUTH]);

  const search = useLocation().search;
  const oAuthState = new URLSearchParams(search).get('state');
  const oAuthCode = new URLSearchParams(search).get('code');

  const classes = useStyles();

  const ShowData = () => {
    if (authState.isLoggedIn) {
      return (
        <Typography variant="caption" gutterBottom>
          You're logged in
        </Typography>
      );
      // return <Redirect to={'/'} />;
    } else if (loading) {
      return <CircularProgress />;
    } else if (_.isEmpty(authState.types)) {
      dispatch(getAuthType());
    } else if (
      oAuthCode != null &&
      oAuthState != null &&
      !loading &&
      !authState.isLoggedIn
    ) {
      dispatch(postAuthParams(oAuthState, oAuthCode));
    } else {
      return (
        <Button
          href={authState.types.oAuthMethods.oAuthLink}
          variant="contained"
          startIcon={<FontAwesomeIcon icon={faGoogle} />}
        >
          {authState.types.oAuthMethods.oAuthName}
        </Button>
      );
    }

    return <p>error getting auth types</p>;
  };

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justify="center"
      style={{ minHeight: '100vh' }}
    >
      <Grid item xs={3}>
        <Paper className={classes.root}>
          <Typography variant="h4" gutterBottom>
            Login
          </Typography>
          <ShowData />
        </Paper>
      </Grid>
    </Grid>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(5, 3),
    minWidth: 280,
    maxWidth: 450,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: 'auto',
  },
  icon: {
    margin: theme.spacing(2),
    fontSize: 60,
    height: 60,
    width: 75,
  },
  button: {
    margin: theme.spacing(3),
    maxWidth: 150,
  },
}));

export default Login;
