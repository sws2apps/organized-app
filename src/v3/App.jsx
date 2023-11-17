import PropTypes from 'prop-types';
import { Suspense } from 'react';
import { CssBaseline } from '@mui/material';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import createTheme from '@mui/material/styles/createTheme';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { ErrorBoundary, WaitingCircular } from '@components';
import { useGlobal } from '@hooks';
import { RootLayout } from '@layouts';
import ComponentPreview from './ComponentsPreview';

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
  breakpoints: {
    values: {
      mobile: 0,
      tablet: 480,
      tablet600: 600,
      laptop: 768,
      desktop: 1200,
    },
  },
});

const queryClient = new QueryClient();

const App = ({ updatePwa }) => {
  const { isSupported } = useGlobal();

  const router = createHashRouter([
    {
      element: <RootLayout updatePwa={updatePwa} />,
      errorElement: <ErrorBoundary />,
      children: [{ path: '*', element: <ComponentPreview /> }],
    },
  ]);

  return (
    <>
      {!isSupported && (
        <div className="browser-not-supported">
          You are using unsupported browser for the Congregation Program for Everyone app. Make sure that your browser
          is up to date, or try to use another browser.
        </div>
      )}

      {isSupported && (
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <CacheProvider value={cache}>
              <Suspense fallback={<WaitingCircular />}>
                <RouterProvider router={router} />
              </Suspense>
            </CacheProvider>
          </ThemeProvider>
        </QueryClientProvider>
      )}
    </>
  );
};

App.propTypes = {
  updatePwa: PropTypes.func,
};

export default App;
