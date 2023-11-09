import React from 'react';
import ReactDOM from 'react-dom/client';
import CurrentVersion from './current/RootWrap';

console.info(`CPE: version ${import.meta.env.PACKAGE_VERSION}`);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CurrentVersion />
  </React.StrictMode>
);
