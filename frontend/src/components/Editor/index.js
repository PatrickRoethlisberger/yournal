import {
  Card,
  CardContent,
  CircularProgress,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Autocomplete, Pagination } from '@material-ui/lab';
import moment from 'moment';
import React from 'react';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import AuthenticatedComponent from '../../helpers/AuthenticatedComponent';
import { getCategories, GET_CATEGORIES } from '../../redux/actions/categories';
import Axios from 'axios';

const Editor = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const categoriesState = useSelector((state) => state.categories);

  const categoriesLoading = useSelector(
    (state) => state.ui.pendingFeatures[GET_CATEGORIES]
  );

  React.useEffect(() => {
    if (_.isEmpty(categoriesState.items)) {
      dispatch(getCategories());
    }
  }, []);

  return (
    <main>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="flex-start"
        spacing={3}
      >
        <Grid item sm={12} md={8}>
          <Grid container direction="column" spacing={3}>
            <Grid item>
              <Card className={classes.card}>
                <CardContent className={classes.filterContent}>
                  <Typography component="h2" variant="h3">
                    Beitrag verfassen
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <Grid item sm={12} md={4} spacing={3}>
          <Grid container direction="column" spacing={3}>
            <Grid item>
              <Card className={classes.card}>
                <CardContent className={classes.filterContent}>
                  <Typography component="h2" variant="h4">
                    Activity
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </main>
  );
};

const useStyles = makeStyles(() => ({
  card: {
    display: 'flex',
  },
  cardDetails: {
    flex: 1,
  },
  cardMedia: {
    width: 160,
  },
  filterContent: {
    width: '100%',
  },
}));

export default AuthenticatedComponent(Editor);
