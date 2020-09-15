import { Grid, makeStyles } from '@material-ui/core';
import React from 'react';
import AuthenticatedComponent from '../../helpers/AuthenticatedComponent';
import PostList from './PostList';

const Home = () => {
  const classes = useStyles();
  return (
    <main>
      <div className={classes.offset} />
      <Grid container direction="row" justify="center" alignItems="flex-start">
        <Grid item xs={12} sm={10}>
          <PostList />
        </Grid>
        <Grid item xs={12} sm={2}>
          <p>main content</p>
        </Grid>
      </Grid>
    </main>
  );
};

const useStyles = makeStyles((theme) => ({
  card: {
    display: 'flex',
  },
  cardDetails: {
    flex: 1,
  },
  cardMedia: {
    width: 160,
  },
  offset: theme.mixins.toolbar,
}));

export default AuthenticatedComponent(Home);
