import {
  Grid,
  makeStyles,
  Paper,
  Typography,
  Card,
  Chip,
  CardContent,
  Button,
} from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AuthenticatedComponent from '../../helpers/AuthenticatedComponent';
import { deletePost, getPost } from '../../redux/actions/post';
import moment from 'moment';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import history from '../../history';

const Post = (props) => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const postState = useSelector((state) => state.post);

  const slug = props.match.params.slug;
  React.useEffect(() => {
    dispatch(getPost(slug));
  }, []);
  return (
    <Card className={classes.card}>
      <CardContent className={classes.filterContent}>
        <Paper
          className={classes.mainFeaturedPost}
          style={{ backgroundImage: `url(${postState.coverImage})` }}
        >
          {
            <img
              style={{ display: 'none' }}
              src={postState.coverImage}
              alt={''}
            />
          }
          <div className={classes.overlay} />
          <Grid container>
            <Grid item md={6}>
              <div className={classes.mainFeaturedPostContent}>
                <Typography
                  component="h1"
                  variant="h3"
                  color="inherit"
                  gutterBottom
                >
                  {postState.title}
                </Typography>
                <Typography variant="subtitle1">
                  Beitrag vom
                  {moment(postState.pubDate).format('[ ]DD.MM.YYYY')} in
                  <Chip
                    style={{ float: 'rigth' }}
                    label={postState.category.name}
                  />
                </Typography>
              </div>
            </Grid>
          </Grid>
        </Paper>
        <Typography variant="body1" gutterBottom>
          {postState.body}
        </Typography>
        <Grid container direction="row" spacing={2}>
          <Grid item>
            <Button
              variant="outlined"
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={() => history.push(`/editor/${postState.slug}`)}
              startIcon={<FontAwesomeIcon icon={faPen} />}
            >
              Beitrag bearbeiten
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={() => dispatch(deletePost(postState.slug))}
              startIcon={<FontAwesomeIcon icon={faTrash} />}
            >
              Beitrag löschen
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const useStyles = makeStyles((theme) => ({
  mainFeaturedPost: {
    position: 'relative',
    backgroundColor: theme.palette.grey[800],
    color: theme.palette.common.white,

    marginBottom: theme.spacing(4),
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,.3)',
  },
  mainFeaturedPostContent: {
    position: 'relative',
    padding: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(6),
      paddingRight: 0,
    },
  },
  card: {
    marginTop: theme.spacing(2),
    display: 'flex',
  },
  cardDetails: {
    flex: 1,
  },
  filterContent: {
    width: '100%',
  },
}));

export default AuthenticatedComponent(Post);
