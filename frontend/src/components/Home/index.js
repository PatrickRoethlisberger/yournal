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
import 'moment/locale/de';
import React from 'react';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import AuthenticatedComponent from '../../helpers/AuthenticatedComponent';
import Calendar from 'react-github-contribution-calendar';
import {
  getPostDates,
  getPosts,
  GET_POSTS,
  GET_POSTSDATES,
  setPage as _setPage,
} from '../../redux/actions/posts';
import PostItem from './PostItem';

const Home = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const postsState = useSelector((state) => state.posts);
  const postsLoading = useSelector(
    (state) => state.ui.pendingFeatures[GET_POSTS]
  );
  const statsLoading = useSelector(
    (state) => state.ui.pendingFeatures[GET_POSTSDATES]
  );

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
        <Grid item xs={12} sm={8}>
          {/* Display loading when count is null */}
          {postsLoading ? (
            <CircularProgress />
          ) : postsState.count ? (
            <Grid container direction="column" spacing={3}>
              {postsState.items.map((el, i) => {
                console.log(moment(new Date(el.pubDate)).fromNow());
                return (
                  <Grid item key={i}>
                    <PostItem
                      title={el.title}
                      category={el.category}
                      coverImage={el.coverImage}
                      // body={el.body}
                      slug={el.slug}
                      pubDate={moment(new Date(el.pubDate)).fromNow()}
                    />
                  </Grid>
                );
              })}
              {/* Only show pagination if there are more than one page */}
              {Math.ceil(postsState.count / postsState.pageSize) > 1 ? (
                <Pagination
                  count={Math.ceil(postsState.count / postsState.pageSize)}
                  page={page}
                  onChange={handlePageChange}
                />
              ) : (
                ' '
              )}
            </Grid>
          ) : (
            <Grid container direction="column" spacing={3}>
              <Grid item>
                <PostItem
                  title={'Keine Beiträge gefunden'}
                  category={null}
                  coverImage={null}
                  body={
                    'Es wurden leider keine Beiträge gefunden 😢 Erstelle einen neuen!'
                  }
                  slug={'editor'}
                />
              </Grid>
            </Grid>
          )}
        </Grid>
        <Grid item xs={12} sm={4}>
          <Grid container direction="column" spacing={3}>
            {!_.isEmpty(postsState.dateCount) && !statsLoading ? (
              <Grid item>
                <Card className={classes.card}>
                  <CardContent className={classes.activityContent}>
                    <Typography component="h2" variant="h4">
                      Activity
                    </Typography>
                    {statsLoading ? (
                      <CircularProgress />
                    ) : (
                      <Calendar
                        values={postsState.dateCount}
                        until={moment().format('YYYY-MM-DD')}
                      />
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ) : (
              <Grid item />
            )}
            {!_.isEmpty(postsState.dateCount) && !statsLoading ? (
              <Grid item>
                <Card className={classes.card}>
                  <CardContent className={classes.activityContent}>
                    <Typography component="h2" variant="h4">
                      Activity
                    </Typography>
                    {statsLoading ? (
                      <CircularProgress />
                    ) : (
                      <Calendar
                        values={postsState.dateCount}
                        until={moment().format('YYYY-MM-DD')}
                      />
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ) : (
              ' '
            )}
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
