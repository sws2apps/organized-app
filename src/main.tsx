import React from 'react';
import { createRoot } from 'react-dom/client';
import AppRoot from './RootWrap';
import { getCSSPropertyValue } from '@utils/common';

const getInitialColor = () => {
  const savedColor = localStorage.getItem('color');

  if (!savedColor) return 'blue';

  try {
    return JSON.parse(savedColor) as string;
  } catch {
    return savedColor;
  }
};

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme');

  if (!savedTheme) return 'light';

  try {
    return JSON.parse(savedTheme) as string;
  } catch {
    return savedTheme;
  }
};

const theme = getInitialTheme();
const color = getInitialColor();

const newTheme = `${color}-${theme}`;

document.documentElement.setAttribute('data-theme', newTheme);

const themeColor = getCSSPropertyValue('--accent-100');

document
  .querySelector("meta[name='theme-color']")
  .setAttribute('content', themeColor);

console.info(`Organized: version ${import.meta.env.PACKAGE_VERSION}`);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppRoot />
  </React.StrictMode>
);
