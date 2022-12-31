import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationE from './locales/e.json';
import translationMG from './locales/mg.json';

const resources = {
  e: { translation: translationE },
  mg: { translation: translationMG },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'e',
  fallbackLng: 'e',

  keySeparator: true,

  interpolation: { escapeValue: false },
});

export default i18n;
