import React from 'react';
import ReactDOM from 'react-dom/client';
import CurrentVersion from './current/RootWrap';
import NextVersion from './v3/RootWrap';

console.info(`CPE: version ${import.meta.env.PACKAGE_VERSION}`);

const appStage = import.meta.env.VITE_APP_STAGE;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {(!appStage || appStage === 'current') && <CurrentVersion />}
    {appStage === 'next' && <NextVersion />}
  </React.StrictMode>
);
