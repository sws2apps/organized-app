import { lazy, Suspense, useEffect, useState } from 'react';
import { RecoilRoot } from 'recoil';
import RecoilOutside from 'recoil-outside';
import Dexie from 'dexie';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import CssBaseline from '@mui/material/CssBaseline';
import ServiceWorkerWrapper from '@sws2apps/react-sw-helper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import logger from '@services/logger/index';
import { DatabaseWrapper, WebWorkerWrapper } from '@wrapper/index';
import App from './App';
import '@global/global.css';
import '@global/index.css';
import { handleSWOnInstalled, handleSWOnUpdated } from '@services/recoil/app';
import '@services/firebase/index';
import '@services/i18n/index';
import WaitingLoader from '@components/waiting_loader';

const Migration = lazy(() => import('./migration'));

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
        text: {
          fontFamily: `${font} !important`,
        },
      },
    },
  },
  breakpoints: {
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
  const [isLoading, setIsLoading] = useState(true);
  const [isMigration, setIsMigration] = useState(false);

  useEffect(() => {
    const checkDb = async () => {
      const isCPE = await Dexie.exists('cpe_sws');
      setIsMigration(isCPE);
      setIsLoading(false);
    };

    checkDb();
  }, []);

  return (
    <RecoilRoot>
      <RecoilOutside />

      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
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
                <>
                  {isLoading && <WaitingLoader type="lottie" />}

                  {!isLoading && isMigration && (
                    <Suspense fallback={<WaitingLoader type="lottie" />}>
                      <Migration updatePwa={update} />
                    </Suspense>
                  )}

                  {!isLoading && !isMigration && (
                    <WebWorkerWrapper>
                      <DatabaseWrapper>
                        <App updatePwa={update} />
                      </DatabaseWrapper>
                    </WebWorkerWrapper>
                  )}
                </>
              )}
            </ServiceWorkerWrapper>
          </CacheProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </RecoilRoot>
  );
};

export default RootWrap;
