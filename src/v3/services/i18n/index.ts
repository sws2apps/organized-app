/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export const defaultNS = 'ui';
const resources = {};

const appLang = localStorage.getItem('app_lang') || 'en';

const languages = [appLang];

if (!languages.includes('en')) languages.push('en');

// programatically load all locales
for await (const language of languages) {
  const activities = await import(`../../../shared/locales/${language}/activities.json`).then(
    (module) => module.default
  );
  const congregation = await import(`../../../shared/locales/${language}/congregation.json`).then(
    (module) => module.default
  );
  const dashboard = await import(`../../../shared/locales/${language}/dashboard.json`).then((module) => module.default);
  const formsTemplates = await import(`../../../shared/locales/${language}/forms-templates.json`).then(
    (module) => module.default
  );
  const general = await import(`../../../shared/locales/${language}/general.json`).then((module) => module.default);
  const meetings = await import(`../../../shared/locales/${language}/meetings.json`).then((module) => module.default);
  const ministry = await import(`../../../shared/locales/${language}/ministry.json`).then((module) => module.default);
  const onboarding = await import(`../../../shared/locales/${language}/onboarding.json`).then(
    (module) => module.default
  );
  const profile = await import(`../../../shared/locales/${language}/profile.json`).then((module) => module.default);

  // load talks namespace
  const talks = await import(`../../public_talks/${language}/public_talks.json`).then((module) => module.default);

  resources[language] = {
    ui: {
      ...activities,
      ...congregation,
      ...dashboard,
      ...general,
      ...onboarding,
      ...profile,
      ...ministry,
      ...meetings,
      ...formsTemplates,
    },
    talks,
  };
}

i18n.use(initReactI18next).init({
  resources,
  defaultNS,
  lng: appLang,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
