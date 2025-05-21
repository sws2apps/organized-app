import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';

import { getAppLang, getListLanguages } from '@services/app';

export const defaultNS = 'ui';

const resources = {};

const appLang = getAppLang();

const languages = await getListLanguages();

// programatically load all locales
for await (const record of languages) {
  const language = record.path;

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

  resources[record.locale] = {
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

const supportedLangs = languages.map((l) => l.locale);

i18n.use(initReactI18next).init({
  resources,
  defaultNS,
  lng: appLang,
  fallbackLng: 'eng',
  supportedLngs: ['eng', appLang, ...supportedLangs],
  interpolation: { escapeValue: false },
});

export default i18n;
