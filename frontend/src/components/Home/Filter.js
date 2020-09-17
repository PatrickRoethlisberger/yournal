import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { KeyboardDatePicker } from '@material-ui/pickers';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCategories, GET_CATEGORIES } from '../../redux/actions/categories';
import { setFilter } from '../../redux/actions/posts';

const Filter = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  // Category filter
  const categoriesState = useSelector((state) => state.categories);
  const categoriesLoading = useSelector(
    (state) => state.ui.pendingFeatures[GET_CATEGORIES]
  );

  const categoriesProp = {
    options: categoriesState.items,
    getOptionLabel: (option) => option.name,
  };

  const [categorieValue, setCategorieValue] = React.useState();

  // Date Filter
  const [selectedFromDate, setSelectedFromDate] = React.useState();
  const [selectedUntilDate, setSelectedUntilDate] = React.useState();

  return (
    <Grid item>
      <Card className={classes.card}>
        <CardContent className={classes.filterContent}>
          <Typography component="h2" variant="h4">
            Filter
          </Typography>
          {categoriesLoading ? (
            <CircularProgress />
          ) : (
            <Autocomplete
              {...categoriesProp}
              onChange={(event, category) => {
                setCategorieValue(category);
                if (category) {
                  dispatch(setFilter({ category: category.name }));
                } else {
                  dispatch(setFilter({ category: null }));
                }
              }}
              id="Kategorie"
              value={categorieValue}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Kategorie"
                  margin="normal"
                  variant="outlined"
                />
              )}
            />
          )}
          <KeyboardDatePicker
            clearable="true"
            disableToolbar="true"
            disableFuture="true"
            variant="inline"
            format="DD/MM/yyyy"
            placeholder="dd/mm/yyyy"
            margin="normal"
            id="date-picker-from"
            label="Von"
            maxDate={selectedUntilDate}
            value={selectedFromDate}
            onChange={(date) => {
              setSelectedFromDate(date);
              if (date) {
                dispatch(setFilter({ fromDate: date }));
              } else {
                dispatch(setFilter({ fromDate: null }));
              }
            }}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
          <KeyboardDatePicker
            clearable="true"
            disableToolbar="true"
            disableFuture="true"
            variant="inline"
            format="DD/MM/yyyy"
            placeholder="dd/mm/yyyy"
            margin="normal"
            id="date-picker-until"
            label="Bis"
            minDate={selectedFromDate}
            value={selectedUntilDate}
            onChange={(date) => {
              setSelectedUntilDate(date);
              if (date) {
                dispatch(setFilter({ untilDate: date }));
                if (!selectedFromDate) {
                  setSelectedFromDate(date);
                }
              } else {
                dispatch(setFilter({ untilDate: null }));
              }
            }}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
          <Button
            onClick={() => {
              dispatch(
                setFilter({ category: null, fromDate: null, untilDate: null })
              );
              // To reload component
              dispatch(getCategories());
            }}
          >
            Filter zurücksetzen
          </Button>
        </CardContent>
      </Card>
    </Grid>
  );
};

const useStyles = makeStyles((theme) => ({
  card: {
    display: 'flex',
  },
  filterContent: {
    width: '100%',
  },
}));

export default Filter;
