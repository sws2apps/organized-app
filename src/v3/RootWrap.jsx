import { RecoilRoot } from 'recoil';
import RecoilOutside from 'recoil-outside';
import ServiceWorkerWrapper from '@sws2apps/react-sw-helper';
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

const RootWrap = () => {
  return (
    <RecoilRoot>
      <RecoilOutside />

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
    </RecoilRoot>
  );
};

export default RootWrap;
