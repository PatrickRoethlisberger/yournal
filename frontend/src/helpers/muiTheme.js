import { createMuiTheme } from '@material-ui/core/styles';
import { orange } from '@material-ui/core/colors';

export default (paletteType) =>
  createMuiTheme({
    palette: {
      type: paletteType,
    },
  });
