import { RecoilRoot } from 'recoil';
import RecoilOutside from 'recoil-outside';
import { CssBaseline } from '@mui/material';
import ServiceWorkerWrapper from '@sws2apps/react-sw-helper';
import { ThemeProvider } from '@mui/material/styles';
import createTheme from '@mui/material/styles/createTheme';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import logger from '@services/logger';
import { DatabaseWrapper } from '@wrapper';
import App from './App';
import './inter.css';
import './global.css';
import './index.css';
import { handleSWOnInstalled, handleSWOnUpdated } from '@services/recoil/app';
import { initializeFirebaseApp } from '@services/firebase/index.js';
import i18n from '@services/i18n/index.js';

initializeFirebaseApp();
await i18n.init();

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
      tablet688: 688,
      laptop: 768,
      desktop: 1200,
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
              <DatabaseWrapper>
                <App updatePwa={update} />
              </DatabaseWrapper>
            )}
          </ServiceWorkerWrapper>
        </CacheProvider>
      </ThemeProvider>
    </RecoilRoot>
  );
};

export default RootWrap;
