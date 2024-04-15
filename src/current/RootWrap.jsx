import { RecoilRoot } from 'recoil';
import RecoilOutside, { promiseSetRecoil } from 'recoil-outside';
import ServiceWorkerWrapper from '@sws2apps/react-sw-helper';
import App from './App';
import './workers/backupWorker';
import './i18n';
import './config/firebase';
import { isPrecachedState, showReloadState } from './states/main';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './global.css';

const RootWrap = () => {
  return (
    <RecoilRoot>
      <RecoilOutside />
      <ServiceWorkerWrapper
        onError={(err) => console.log(`An error occured: ${err}`)}
        onInstalled={() => onSWInstalled()}
        onUpdated={() => onSWUpdated()}
        onWaiting={() => onSWUpdated()}
        publicServiceWorkerDest="/service-worker.js"
      >
        {({ update }) => <App updatePwa={update} />}
      </ServiceWorkerWrapper>
    </RecoilRoot>
  );
};

const onSWInstalled = () => {
  promiseSetRecoil(isPrecachedState, true);
  console.info('CPE: Service Worker: installed');
};

const onSWUpdated = () => {
  promiseSetRecoil(showReloadState, true);
  console.info('CPE: Service Worker:  updated');
};

export default RootWrap;
