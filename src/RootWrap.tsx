import { useRecoilState, useRecoilValue } from 'recoil';
import { LocalizationProvider as MUILocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { Provider } from 'jotai';
import ServiceWorkerWrapper from '@sws2apps/react-sw-helper';

import { DatabaseWrapper } from '@wrapper/index';
import { handleSWOnInstalled, handleSWOnUpdated } from '@services/states/app';
import { store } from './states';
import logger from '@services/logger/index';
import App from './App';
import '@global/global.css';
import '@global/index.css';
import '@services/firebase/index';
import '@services/i18n/index';
import { ReactNode, useEffect } from 'react';
import { enUS } from 'date-fns/locale';
import { firstDayOfTheWeekState } from '@states/settings';
import { useAppTranslation } from './hooks';
import { currentLocaleState } from '@states/app';

const LocalizationProvider = ({ children }: { children: ReactNode }) => {
  const firstDayOfTheWeek = useRecoilValue(firstDayOfTheWeekState);
  const { t } = useAppTranslation();
  const [currentLocale, setCurrentLocale] = useRecoilState(currentLocaleState);

  useEffect(() => {
    const loadLocale = async () => {
      const locales = await import('date-fns/locale');
      const selectedLocale = locales[t('tr_iso')] || enUS;

      setCurrentLocale({
        ...selectedLocale,
        options: {
          ...(selectedLocale.options ?? {}),
          weekStartsOn: firstDayOfTheWeek,
        },
      });
    };

    loadLocale();
  }, [t, firstDayOfTheWeek, setCurrentLocale]);

  return (
    <MUILocalizationProvider
      dateAdapter={AdapterDateFns}
      adapterLocale={currentLocale}
    >
      {children}
    </MUILocalizationProvider>
  );
};

const RootWrap = () => {
  return (
    <Provider store={store}>
      <LocalizationProvider>
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
      </LocalizationProvider>
    </Provider>
  );
};

export default RootWrap;
