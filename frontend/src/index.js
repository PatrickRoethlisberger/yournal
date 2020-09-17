import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import store from './redux/store';
import { Provider } from 'react-redux';
import { Router, Route, Link } from 'react-router-dom';
import history from './history';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import 'moment/locale/de';

// Configure moment to use german strings
moment.locale('de');

ReactDOM.render(
  <Provider store={store}>
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <Router history={history}>
        <App />
      </Router>
    </MuiPickersUtilsProvider>
  </Provider>,
  document.getElementById('root')
);
