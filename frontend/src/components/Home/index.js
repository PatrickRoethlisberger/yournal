import {
  Card,
  CardContent,
  CircularProgress,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import moment from 'moment';
import React from 'react';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import AuthenticatedComponent from '../../helpers/AuthenticatedComponent';
import Calendar from 'react-github-contribution-calendar';
import {
  getPostDates,
  getPosts,
  setPage as _setPage,
} from '../../redux/actions/post';
import { showNotification } from '../../redux/actions/ui';
import PostItem from './PostItem';

const Home = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const postsState = useSelector((state) => state.posts);

  const [page, setPage] = React.useState(1);
  const handlePageChange = (event, value) => {
    setPage(value);
    dispatch(_setPage(value));
  };

  // Configure moment to use german strings
  moment.locale('de');

  React.useEffect(() => {
    dispatch(getPosts());
    dispatch(getPostDates());
  }, []);

  return (
    <main>
      <div className={classes.offset} />
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="flex-start"
        spacing={3}
      >
        <Grid item xs={12} sm={10}>
          {/* Display loading when count is null */}
          {!postsState.count ? (
            <CircularProgress />
          ) : (
            <Grid container direction="column" spacing={3}>
              {postsState.items.map((el, i) => {
                return (
                  <Grid item key={i}>
                    <PostItem
                      title={el.title}
                      category={el.category}
                      coverImage={el.coverImage}
                      body={el.body}
                      slug={el.slug}
                      pubDate={moment(new Date(el.createdAt)).fromNow()}
                    />
                  </Grid>
                );
              })}
              <Pagination
                count={Math.ceil(postsState.count / postsState.pageSize)}
                page={page}
                onChange={handlePageChange}
              />{' '}
            </Grid>
          )}
        </Grid>
        <Grid item xs={12} sm={2}>
          <Grid container direction="column" spacing={3}>
            <Grid item>
              <Card className={classes.card}>
                <CardContent className={classes.activityContent}>
                  <Typography component="h2" variant="h4">
                    Activity
                  </Typography>
                  {!_.isEmpty(postsState.dateCount) ? (
                    <Calendar
                      values={postsState.dateCount}
                      until={moment().format('YYYY-MM-DD')}
                    />
                  ) : (
                    <CircularProgress />
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
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
  activityContent: {
    width: '100%',
  },
}));

export default AuthenticatedComponent(Home);
