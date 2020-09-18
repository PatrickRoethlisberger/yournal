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
  GET_POSTS,
  GET_POSTSDATES,
  setPage as _setPage,
} from '../../redux/actions/posts';
import PostItem from './PostItem';
import { getCategories, GET_CATEGORIES } from '../../redux/actions/categories';
import Filter from './Filter';

const Home = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const postsState = useSelector((state) => state.posts);
  const categoriesState = useSelector((state) => state.categories);

  const postsLoading = useSelector((state) => state.ui.pendingFeatures);
  const statsLoading = useSelector(
    (state) => state.ui.pendingFeatures[GET_POSTSDATES]
  );
  const categoriesLoading = useSelector(
    (state) => state.ui.pendingFeatures[GET_CATEGORIES]
  );

  const [page, setPage] = React.useState(1);
  const handlePageChange = (event, value) => {
    setPage(value);
    dispatch(_setPage(value));
  };

  React.useEffect(() => {
    dispatch(getPosts());
    if (_.isEmpty(postsState.dateCount)) {
      dispatch(getPostDates());
    }

    if (_.isEmpty(categoriesState.items)) {
      dispatch(getCategories());
    }
  }, [dispatch, postsState.dateCount, categoriesState.items]);

  return (
    <main>
      <Grid
        container
        direction="row-reverse"
        justify="center"
        alignItems="flex-start"
        spacing={3}
      >
        <Grid item sm={12} md={4}>
          <Grid container direction="column" spacing={3}>
            <Grid item />
            {!_.isEmpty(postsState.dateCount) && !statsLoading ? (
              <Grid item>
                <Card className={classes.card}>
                  <CardContent className={classes.filterContent}>
                    <Typography component="h2" variant="h5">
                      Activity
                    </Typography>
                    {statsLoading ? (
                      <CircularProgress />
                    ) : (
                      <Calendar
                        panelColors={panelColors}
                        values={postsState.dateCount}
                        until={moment().format('YYYY-MM-DD')}
                      />
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ) : (
              ''
            )}
            {!_.isEmpty(categoriesState.items) && !categoriesLoading ? (
              <Filter />
            ) : (
              ' '
            )}
          </Grid>
        </Grid>
        <Grid item sm={12} md={8}>
          {/* Display loading when count is null */}
          {postsLoading[GET_POSTS] ? (
            <CircularProgress />
          ) : postsState.count ? (
            <Grid container direction="column" spacing={3}>
              <Grid item />
              {postsState.items.map((el, i) => {
                return (
                  <Grid item key={i}>
                    <PostItem
                      title={el.title}
                      category={el.category}
                      coverImage={el.coverImage}
                      url={`post/${el.slug}`}
                      pubDate={moment(new Date(el.pubDate)).format(
                        'DD.MM.YYYY'
                      )}
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
                  url={'/editor'}
                />
              </Grid>
            </Grid>
          )}
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

var panelColors = ['#e8f5e9', '#a5d6a7', '#66bb6a', '#43a047', '#2e7d32'];

export default AuthenticatedComponent(Home);
