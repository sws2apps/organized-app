import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { LANGUAGE_LIST } from '@constants/index';

const resources = {};

// programatically load all locales
for await (const language of LANGUAGE_LIST) {
  // load ui namespace
  const dashboard = await import(`../../../shared/locales/${language.locale}/dashboard.json`).then(
    (module) => module.default
  );
  const general = await import(`../../../shared/locales/${language.locale}/general.json`).then(
    (module) => module.default
  );
  const onboarding = await import(`../../../shared/locales/${language.locale}/onboarding.json`).then(
    (module) => module.default
  );

  // load source namespace
  const source = await import(`../../../shared/locales/${language.locale}/forms-templates.json`).then(
    (module) => module.default
  );

  resources[language.code] = {
    ui: { ...dashboard, ...general, ...onboarding },
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
