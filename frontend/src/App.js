import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Auth from './components/auth';
import Login from './components/login';

function App() {
  return (
    <Switch>
      {/* <Route exact path={'/'} component={} /> */}
      <Route exact path={'/auth'} component={Auth} />
      <Route path={'/login'} component={Login} />
      <Redirect to={'/'} />
    </Switch>
  );
}

export default App;
