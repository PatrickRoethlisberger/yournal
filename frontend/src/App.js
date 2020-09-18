import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import MenuBar from './components/MenuBar';
import Home from './components/Home';
import Login from './components/Login';
import Post from './components/Post';
import Editor from './components/Editor';
import Snackbar from './components/Snackbar';
import { useSelector } from 'react-redux';
import {
  ThemeProvider,
  Container,
  CssBaseline,
  makeStyles,
} from '@material-ui/core';
import muiTheme from './helpers/muiTheme';
import SetUsernameDialog from './components/SetUsernameDialog';

function App() {
  const paletteType = useSelector((state) => state.ui.paletteType);
  const theme = muiTheme(paletteType);
  const classes = useStyles();
  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <Container
          maxWidth="lg"
          style={{
            minHeight: '100vh',
          }}
        >
          <CssBaseline />
          <MenuBar />
          <div className={classes.offset} />
          <Switch>
            <Route exact path={'/'} component={Home} />
            <Route path={'/login'} component={Login} />
            <Route path={'/post/:slug'} component={Post} />
            <Route exact path={'/editor'} component={Editor} />
            <Route path={'/editor/:slug'} component={Editor} />
            <Redirect to={'/'} />
          </Switch>
        </Container>
        <Snackbar />
        <SetUsernameDialog />
      </ThemeProvider>
    </React.Fragment>
  );
}

const useStyles = makeStyles((theme) => ({
  offset: theme.mixins.toolbar,
}));

export default App;
