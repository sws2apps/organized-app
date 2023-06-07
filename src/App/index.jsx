import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { QueryClientProvider } from '@tanstack/react-query';
import CssBaseline from '@mui/material/CssBaseline';
import { InternetChecker } from '../features/internetChecker';
import NotificationWrapper from '../features/notificationWrapper';
import WaitingPage from '../components/WaitingPage';
import useApp from './useApp';

// creating theme
const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const App = ({ updatePwa }) => {
  const { isLoading, isSupported, activeTheme, appSnackOpen, router, queryClient } = useApp({
    themes: { lightTheme, darkTheme },
    updatePwa,
  });

  if (isLoading) {
    return <WaitingPage />;
  }

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
          <ThemeProvider theme={activeTheme}>
            <CssBaseline />
            <InternetChecker />
            {appSnackOpen && <NotificationWrapper />}
            <Suspense fallback={<WaitingPage />}>
              <RouterProvider router={router} />
            </Suspense>
          </ThemeProvider>
        </QueryClientProvider>
      )}
    </>
  );
};

export default App;
