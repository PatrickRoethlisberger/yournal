import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {
  Button,
  Container,
  Grid,
  Hidden,
  IconButton,
  Menu,
  MenuItem,
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/actions/auth';
import history from '../history';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faBook,
  faMoon,
  faSignOutAlt,
  faSun,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { goDark, goLight } from '../redux/actions/ui';

const MenuBar = () => {
  const dispatch = useDispatch();

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const theme = useSelector((state) => state.ui.paletteType);

  const [anchorEl, setAnchorEl] = React.useState(null);

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Container>
          <Grid container alignItems="center" justify="space-between">
            <Grid item>
              <Button
                onClick={() => history.push('/')}
                startIcon={<FontAwesomeIcon icon={faBook} />}
              >
                <Typography variant="h6" color="inherit" noWrap>
                  Yournal
                </Typography>
              </Button>
            </Grid>
            {isLoggedIn ? (
              <Grid item>
                <Grid container alignItems="center" spacing={1}>
                  <Hidden xsDown>
                    <Grid item>
                      <Button
                        variant="outlined"
                        onClick={() => history.push('/editor')}
                      >
                        Beitrag erstellen
                      </Button>
                    </Grid>
                    <Grid item>
                      {theme === 'dark' ? (
                        <IconButton
                          aria-controls="simple-menu"
                          aria-haspopup="true"
                          onClick={() => dispatch(goLight())}
                        >
                          <FontAwesomeIcon icon={faSun} />
                        </IconButton>
                      ) : (
                        <IconButton
                          aria-controls="simple-menu"
                          aria-haspopup="true"
                          onClick={() => dispatch(goDark())}
                        >
                          <FontAwesomeIcon icon={faMoon} />
                        </IconButton>
                      )}
                    </Grid>
                    <Grid item>
                      <IconButton
                        aria-controls="logout"
                        aria-haspopup="true"
                        onClick={() => dispatch(logout())}
                      >
                        <FontAwesomeIcon icon={faSignOutAlt} />
                      </IconButton>
                    </Grid>
                  </Hidden>
                  <Hidden smUp>
                    <Grid item>
                      <IconButton
                        aria-controls="simple-menu"
                        aria-haspopup="true"
                        onClick={(event) => setAnchorEl(event.currentTarget)}
                      >
                        <FontAwesomeIcon icon={faBars} />
                      </IconButton>
                      <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={() => setAnchorEl(null)}
                      >
                        <MenuItem onClick={() => history.push('/editor')}>
                          Beitrag erstellen
                        </MenuItem>
                        {theme === 'dark' ? (
                          <MenuItem onClick={() => dispatch(goLight())}>
                            Light-Theme
                          </MenuItem>
                        ) : (
                          <MenuItem onClick={() => dispatch(goDark())}>
                            Dark-Theme
                          </MenuItem>
                        )}
                        <MenuItem onClick={() => dispatch(logout())}>
                          Logout
                        </MenuItem>
                      </Menu>
                    </Grid>
                  </Hidden>
                </Grid>
              </Grid>
            ) : (
              ''
            )}
          </Grid>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default MenuBar;
