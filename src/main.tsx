import React from 'react';
import { createRoot } from 'react-dom/client';
import AppRoot from './RootWrap';

console.info(`Organized: version ${import.meta.env.PACKAGE_VERSION}`);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppRoot />
  </React.StrictMode>
);
