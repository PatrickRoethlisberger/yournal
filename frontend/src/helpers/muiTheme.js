import { createMuiTheme } from '@material-ui/core/styles';
import { amber } from '@material-ui/core/colors';

export default (paletteType) =>
  createMuiTheme({
    palette: {
      type: paletteType,
      primary: amber,
    },
  });
