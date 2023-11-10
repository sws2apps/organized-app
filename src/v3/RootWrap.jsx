import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import '@fontsource/inter/200.css';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import App from './App';
import './global.css';
import './index.css';

const cache = createCache({
  key: 'css',
  prepend: true,
});

const theme = createTheme({
  typography: {
    allVariants: {
      fontFamily: 'Inter',
    },
  },
});

const RootWrap = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CacheProvider value={cache}>
        <App />
      </CacheProvider>
    </ThemeProvider>
  );
};

export default RootWrap;
