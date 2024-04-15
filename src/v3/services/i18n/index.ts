/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { LANGUAGE_LIST } from '@constants/index';

export const defaultNS = 'ui';
const resources = {};

// programatically load all locales
for await (const language of LANGUAGE_LIST) {
  const activities = await import(`../../../shared/locales/${language.locale}/activities.json`).then(
    (module) => module.default
  );
  const congregation = await import(`../../../shared/locales/${language.locale}/congregation.json`).then(
    (module) => module.default
  );
  const dashboard = await import(`../../../shared/locales/${language.locale}/dashboard.json`).then(
    (module) => module.default
  );
  const formsTemplates = await import(`../../../shared/locales/${language.locale}/forms-templates.json`).then(
    (module) => module.default
  );
  const general = await import(`../../../shared/locales/${language.locale}/general.json`).then(
    (module) => module.default
  );
  const meetings = await import(`../../../shared/locales/${language.locale}/meetings.json`).then(
    (module) => module.default
  );
  const ministry = await import(`../../../shared/locales/${language.locale}/ministry.json`).then(
    (module) => module.default
  );
  const onboarding = await import(`../../../shared/locales/${language.locale}/onboarding.json`).then(
    (module) => module.default
  );
  const profile = await import(`../../../shared/locales/${language.locale}/profile.json`).then(
    (module) => module.default
  );

  const talks = await import(`../../public_talks/${language.locale}/public_talks.json`).then(
    (module) => module.default
  );

  // load source namespace

  resources[language.locale] = {
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
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
