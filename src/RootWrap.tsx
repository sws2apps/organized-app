import { RecoilRoot } from 'recoil';
import RecoilOutside from 'recoil-outside';
import CssBaseline from '@mui/material/CssBaseline';
import ServiceWorkerWrapper from '@sws2apps/react-sw-helper';
import { ThemeProvider } from '@mui/material/styles';
import createTheme from '@mui/material/styles/createTheme';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import logger from '@services/logger/index';
import { DatabaseWrapper, WebWorkerWrapper } from '@wrapper/index';
import App from './App';
import '@global/global.css';
import '@global/index.css';
import { handleSWOnInstalled, handleSWOnUpdated } from '@services/recoil/app';
import '@services/firebase/index';
import i18n from '@services/i18n/index';

await i18n.init();

const font = localStorage.getItem('app_font') || 'Inter';

const cache = createCache({
  key: 'css',
  prepend: true,
});

const theme = createTheme({
  typography: {
    allVariants: {
      fontFamily: font,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: font,
        },
        span: {
          fontFamily: `${font} !important`,
        },
      },
    },
  },
  breakpoints: {
    keys: [
      'mobile',
      'mobile400',
      'tablet',
      'tablet500',
      'tablet600',
      'tablet688',
      'laptop',
      'desktop',
    ],
    values: {
      mobile: 0,
      mobile400: 400,
      tablet: 480,
      tablet500: 500,
      tablet600: 600,
      tablet688: 688,
      laptop: 768,
      desktop: 1200,
      desktopLarge: 1400,
    },
  },
});

const RootWrap = () => {
  return (
    <RecoilRoot>
      <RecoilOutside />

      <ThemeProvider theme={theme}>
        <CssBaseline />
        <CacheProvider value={cache}>
          <ServiceWorkerWrapper
            publicServiceWorkerDest="/service-worker.js"
            onError={(err) => logger.error('app', `An error occured: ${err}`)}
            onInstalled={handleSWOnInstalled}
            onUpdated={handleSWOnUpdated}
            onWaiting={handleSWOnUpdated}
          >
            {({ update }) => (
              <WebWorkerWrapper>
                <DatabaseWrapper>
                  <App updatePwa={update} />
                </DatabaseWrapper>
              </WebWorkerWrapper>
            )}
          </ServiceWorkerWrapper>
        </CacheProvider>
      </ThemeProvider>
    </RecoilRoot>
  );
};

export default RootWrap;
