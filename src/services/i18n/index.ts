import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';

import { LANGUAGE_LIST } from '@constants/index';
import { getAppLang } from '@services/app';
import appDb from '@db/appDb';

export const defaultNS = 'ui';

const resources = {};

const settings = await appDb.app_settings.get(1);

let dataView = '';

if (typeof settings.user_settings.data_view === 'string') {
  dataView = settings.user_settings.data_view;
} else {
  dataView = settings.user_settings.data_view.value;
}

const languageGroups = Array.isArray(settings.cong_settings.language_groups)
  ? []
  : settings.cong_settings.language_groups.groups;

const JWLang =
  settings.cong_settings.source_material?.language.find(
    (record) => record.type === dataView
  )?.value ?? 'E';

const sourceLang =
  LANGUAGE_LIST.find((record) => record.code.toUpperCase() === JWLang)
    ?.threeLettersCode ?? 'eng';

const appLang = getAppLang();

const appLangPath =
  LANGUAGE_LIST.find((record) => record.threeLettersCode === appLang)?.locale ??
  'en';

const languages = [{ locale: appLang, path: appLangPath }];

if (sourceLang !== appLang) {
  const sourceLangPath =
    LANGUAGE_LIST.find((record) => record.threeLettersCode === sourceLang)
      ?.locale || 'en';

  languages.push({ locale: sourceLang, path: sourceLangPath });
}

if (!languages.some((r) => r.locale === 'eng')) {
  languages.push({ locale: 'eng', path: 'en' });
}

for (const group of languageGroups) {
  const record = LANGUAGE_LIST.find(
    (record) => record.code.toLowerCase() === group.language.toLowerCase()
  );

  const exist = languages.some(
    (exist) => exist.locale === record.threeLettersCode
  );

  if (!exist) {
    languages.push({ locale: record.threeLettersCode, path: record.locale });
  }
}

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

i18n.use(initReactI18next).init({
  resources,
  defaultNS,
  lng: appLang,
  fallbackLng: 'eng',
  supportedLngs: ['eng', appLang, sourceLang],
  interpolation: { escapeValue: false },
});

export default i18n;
