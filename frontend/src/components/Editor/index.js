import {
  Button,
  Card,
  CardContent,
  Grid,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import { Autocomplete, createFilterOptions } from '@material-ui/lab';
import moment from 'moment';
import React from 'react';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import AuthenticatedComponent from '../../helpers/AuthenticatedComponent';
import { createCategory, getCategories } from '../../redux/actions/categories';
import { postImage } from '../../redux/actions/editor';
import { KeyboardDatePicker } from '@material-ui/pickers';
import {
  clearPost,
  getPost,
  publishPost,
  updatePost,
  updatePostProp,
} from '../../redux/actions/post';

const Editor = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const filter = createFilterOptions();

  const categoriesState = useSelector((state) => state.categories);
  const postState = useSelector((state) => state.post);

  const slug = props.match.params.slug;

  React.useEffect(() => {
    if (_.isEmpty(categoriesState.items)) {
      dispatch(getCategories());
    }
    if (slug) {
      dispatch(getPost(slug));
    } else {
      dispatch(clearPost());
    }
  }, [dispatch, categoriesState.items, slug]);

  const handleImageUpload = (e) => {
    dispatch(postImage(e.target.files[0]));
  };

  return (
    <main>
      <Grid container direction="column" spacing={3}>
        <Grid item />
        <Grid item>
          <Card className={classes.card}>
            <CardContent className={classes.filterContent}>
              <Grid container direction="column" spacing={1}>
                <Grid item>
                  {_.isEmpty(postState.slug) ? (
                    <Typography component="h1" variant="h4">
                      Beitrag verfassen
                    </Typography>
                  ) : (
                    <Typography component="h1" variant="h4">
                      Beitrag bearbeiten
                    </Typography>
                  )}
                </Grid>
                <Grid item>
                  <TextField
                    id="title"
                    label="Titel"
                    placeholder="Titel"
                    required
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={postState.title}
                    onChange={(e) => {
                      dispatch(updatePostProp({ title: e.target.value }));
                    }}
                  />
                </Grid>
                <Grid item>
                  <Grid container direction="row" spacing={2}>
                    <Grid item>
                      <Button
                        variant="outlined"
                        component="label"
                        style={{ height: '100%' }}
                      >
                        Bild hochladen
                        <input
                          required
                          type="file"
                          accept="image/*"
                          name="file"
                          style={{ display: 'none' }}
                          onChange={handleImageUpload}
                        />
                      </Button>
                    </Grid>
                    {!_.isEmpty(postState.coverImage) ? (
                      <Grid item>
                        <img
                          style={{ height: 50 }}
                          src={postState.coverImage}
                          alt={''}
                        />
                      </Grid>
                    ) : (
                      ''
                    )}
                    <Grid item>
                      <Autocomplete
                        value={postState.category}
                        onChange={(event, newValue) => {
                          if (typeof newValue === 'string') {
                            dispatch(
                              updatePostProp({
                                category: newValue,
                              })
                            );
                          } else if (newValue && newValue.inputValue) {
                            // Create a new value from the user input
                            dispatch(createCategory(newValue.inputValue));
                            dispatch(
                              updatePostProp({
                                category: { name: newValue.inputValue },
                              })
                            );
                          } else {
                            dispatch(
                              updatePostProp({
                                category: newValue,
                              })
                            );
                          }
                        }}
                        filterOptions={(options, params) => {
                          const filtered = filter(options, params);

                          // Suggest the creation of a new value
                          if (params.inputValue !== '') {
                            filtered.push({
                              inputValue: params.inputValue,
                              name: `"${params.inputValue}" erstellen`,
                            });
                          }

                          return filtered;
                        }}
                        selectOnFocus
                        clearOnBlur
                        handleHomeEndKeys
                        required
                        id="category"
                        options={categoriesState.items}
                        getOptionLabel={(option) => {
                          // Value selected with enter, right from the input
                          if (typeof option === 'string') {
                            return option;
                          }
                          // "xyz" hinzufügen option created dynamically
                          if (option.inputValue) {
                            return option.inputValue;
                          }
                          // Regular option
                          return option.name;
                        }}
                        renderOption={(option) => option.name}
                        style={{ width: 300 }}
                        freeSolo
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Kategorie *"
                            variant="outlined"
                          />
                        )}
                      />
                    </Grid>
                    <Grid item>
                      <KeyboardDatePicker
                        required
                        disableToolbar="true"
                        disableFuture="true"
                        variant="inline"
                        format="DD/MM/yyyy"
                        placeholder="dd/mm/yyyy"
                        margin="normal"
                        id="date-picker"
                        label="Post Datum"
                        value={
                          postState.pubDate ? new Date(postState.pubDate) : null
                        }
                        onChange={(date) => {
                          dispatch(updatePostProp({ pubDate: moment(date) }));
                        }}
                        KeyboardButtonProps={{
                          'aria-label': 'change date',
                        }}
                        style={{ margin: 0 }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <TextField
                    id="body"
                    label="Text"
                    placeholder="Beitrags Inhalt"
                    required
                    fullWidth
                    multiline
                    margin="normal"
                    variant="filled"
                    value={postState.body}
                    onChange={(e) => {
                      dispatch(updatePostProp({ body: e.target.value }));
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      rowsMin: 5,
                      maxLength: 1000,
                    }}
                  />
                </Grid>
                <Grid item>
                  {_.isEmpty(postState.slug) ? (
                    <Button
                      variant="contained"
                      disabled={
                        _.isEmpty(postState.title) ||
                        _.isEmpty(postState.coverImage) ||
                        _.isEmpty(postState.category) ||
                        _.isEmpty(postState.pubDate) ||
                        _.isEmpty(postState.body)
                      }
                      onClick={() => {
                        dispatch(publishPost());
                      }}
                    >
                      Beitrag erstellen
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      disabled={
                        _.isEmpty(postState.title) ||
                        _.isEmpty(postState.coverImage) ||
                        _.isEmpty(postState.category) ||
                        _.isEmpty(postState.pubDate) ||
                        _.isEmpty(postState.body)
                      }
                      onClick={() => {
                        dispatch(updatePost());
                      }}
                    >
                      Beitrag speichern
                    </Button>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
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
