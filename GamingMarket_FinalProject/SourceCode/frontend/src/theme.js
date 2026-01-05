import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#202529ff' },
    secondary: { main: '#f50057' }
  },
  components: {
    MuiAppBar: {
      defaultProps: {
        elevation: 1
      }
    }
  }
});

export default theme;
