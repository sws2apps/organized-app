import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';

import { LANGUAGE_LIST } from '@constants/index';

export const defaultNS = 'ui';

const resources = {};

const appLang = localStorage.getItem('ui_lang') || 'en';

const identifier =
  LANGUAGE_LIST.find((record) => record.locale === appLang)?.identifier ||
  appLang;

const languages = [{ locale: appLang, identifier }];

if (!languages.some((r) => r.locale === 'en'))
  languages.push({ locale: 'en', identifier: 'en' });

// programatically load all locales
for await (const record of languages) {
  const language = record.locale;

  const activities = await import(`@locales/${language}/activities.json`).then(
    (module) => module.default
  );
  const congregation = await import(
    `@locales/${language}/congregation.json`
  ).then((module) => module.default);

  const dashboard = await import(`@locales/${language}/dashboard.json`).then(
    (module) => module.default
  );
  const formsTemplates = await import(
    `@locales/${language}/forms-templates.json`
  ).then((module) => module.default);
  const general = await import(`@locales/${language}/general.json`).then(
    (module) => module.default
  );
  const meetings = await import(`@locales/${language}/meetings.json`).then(
    (module) => module.default
  );
  const ministry = await import(`@locales/${language}/ministry.json`).then(
    (module) => module.default
  );
  const onboarding = await import(`@locales/${language}/onboarding.json`).then(
    (module) => module.default
  );
  const profile = await import(`@locales/${language}/profile.json`).then(
    (module) => module.default
  );
  const errors = await import(`@locales/${language}/errors.json`).then(
    (module) => module.default
  );

  // load talks namespace
  const talks = await import(`@locales/${language}/public_talks.json`).then(
    (module) => module.default
  );

  // load songs namespace
  const songs = await import(`@locales/${language}/songs.json`).then(
    (module) => module.default
  );

  // load releases namespace
  const releases = await import(`@locales/${language}/release_notes.json`).then(
    (module) => module.default
  );

  resources[record.identifier] = {
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
      ...errors,
    },
    talks,
    songs,
    releases,
  };
}

i18n.use(initReactI18next).init({
  resources,
  defaultNS,
  lng: identifier,
  fallbackLng: 'en',
  supportedLngs: ['en', identifier],
  interpolation: { escapeValue: false },
});

export default i18n;
