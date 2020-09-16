import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Hidden,
  makeStyles,
  Typography,
} from '@material-ui/core';
import React from 'react';

const PostItem = ({ title, category, coverImage, body, slug, pubDate }) => {
  const classes = useStyles();
  return (
    <CardActionArea component="a" href={`/post/${slug}`}>
      <Card className={classes.card}>
        <div className={classes.cardDetails}>
          <CardContent>
            <Typography component="h2" variant="h5">
              {title}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {pubDate}
            </Typography>
            <Typography variant="subtitle1" paragraph>
              {body}
            </Typography>
            <Typography variant="subtitle1" color="primary">
              Continue reading...
            </Typography>
          </CardContent>
        </div>
        <Hidden xsDown>
          <CardMedia className={classes.cardMedia} image={coverImage} />
        </Hidden>
      </Card>
    </CardActionArea>
  );
};

const useStyles = makeStyles({
  card: {
    display: 'flex',
  },
  cardDetails: {
    flex: 1,
  },
  cardMedia: {
    width: 240,
  },
});

export default PostItem;