import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { LANGUAGE_LIST } from './locales/langList';

const resources = {};

// programatically load all locales
for await (const language of LANGUAGE_LIST) {
  // load ui namespace
  const ui = await import(`./locales/ui/${language.code}.json`).then((module) => module.default);
  // load source namespace
  const source = await import(`./locales/source/${language.code}.json`).then((module) => module.default);

  resources[language.code] = {
    ui,
    source,
  };
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'e',
  fallbackLng: 'e',
  keySeparator: true,
  interpolation: { escapeValue: false },
});

export default i18n;
