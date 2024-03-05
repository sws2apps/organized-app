import React from 'react';
import { createRoot } from 'react-dom/client';
// import CurrentVersion from './current/RootWrap';
import NextVersion from './v3/RootWrap';

console.info(`CPE: version ${import.meta.env.PACKAGE_VERSION}`);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NextVersion />
  </React.StrictMode>
);
