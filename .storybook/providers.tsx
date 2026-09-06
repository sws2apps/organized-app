import { ReactNode, useEffect } from 'react';
import { MemoryRouter } from 'react-router';
import { Provider, useAtomValue } from 'jotai';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { store } from '../src/states';
import {
  apiHostState,
  appThemeNameState,
  appThemeState,
  colorSchemeState,
} from '../src/states/app';
import { DatabaseWrapper } from '../src/wrapper/index';
import { ColorSchemeType } from '../src/definition/app';

// API calls resolve against the Storybook origin, where MSW intercepts them.
store.set(apiHostState, '/');

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

/**
 * Mirrors what `src/main.tsx` and the theme switcher do in the real app:
 * the `data-theme` attribute drives the CSS variables in `global.css`,
 * while the Jotai atoms keep `isDarkThemeState`/`colorSchemeState` in sync.
 */
export const AppTheme = ({
  theme,
  children,
}: {
  theme: string;
  children: ReactNode;
}) => {
  const [color, mode] = theme.split('-');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', `${color}-${mode}`);
    store.set(colorSchemeState, color as ColorSchemeType);
    store.set(appThemeNameState, mode);
  }, [color, mode]);

  return children;
};

const MuiTheme = ({ children }: { children: ReactNode }) => {
  const theme = useAtomValue(appThemeState);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

/**
 * Same provider tree as `src/RootWrap.tsx` + `src/App.tsx`, minus the
 * service worker and the hash router.
 */
export const AppProviders = ({ children }: { children: ReactNode }) => (
  <Provider store={store}>
    <DatabaseWrapper>
      <MuiTheme>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <QueryClientProvider client={queryClient}>
            <MemoryRouter>{children}</MemoryRouter>
          </QueryClientProvider>
        </LocalizationProvider>
      </MuiTheme>
    </DatabaseWrapper>
  </Provider>
);
