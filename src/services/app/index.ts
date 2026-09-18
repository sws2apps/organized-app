import { enUS } from 'date-fns/locale';
import { store } from '@states/index';
import {
  generateDayCapitalNames,
  generateMonthNames,
  getTranslation,
  handleAppChangeLanguage,
} from '@services/i18n/translation';
import {
  appLangState,
  congAccountConnectedState,
  isAppLoadState,
  isPocketSignUpState,
  isSetupState,
  offlineOverrideState,
} from '@states/app';
import { userSignOut } from '@services/firebase/auth';
import {
  disconnectCongAccount,
  displaySnackNotification,
  setRootModalOpen,
} from '@services/states/app';
import { dbWeekTypeUpdate } from '@services/dexie/weekType';
import { dbAssignmentUpdate } from '@services/dexie/assignment';
import {
  dbAppDelete,
  dbAppGetAssignmentHistorySources,
} from '@services/dexie/app';
import { schedulesBuildHistoryList } from './schedules';
import { setAssignmentsHistory } from '@services/states/schedules';
import {
  dbSchedAuxClassUpdate,
  dbSchedUpdateOutgoingTalksFields,
} from '@services/dexie/schedules';
import { LANGUAGE_LIST } from '@constants/index';
import { dbMetadataDefault } from '@services/dexie/metadata';
import {
  dbAppSettingsCreatePublishersSort,
  dbAppSettingsGet,
  dbAppSettingsUpdate,
  dbAppSettingsUpdateCongNumber,
  dbAppSettingsUpdateWithoutNotice,
  dbConvertAutoAssignPrayers,
} from '@services/dexie/settings';
import { dbRemoveDuplicateReports } from '@services/dexie/cong_field_service_reports';
import { LanguageItem } from '@definition/app';
import {
  dbPersonsCleanUp,
  dbPersonsUpdateAssignments,
} from '@services/dexie/persons';
import {
  dbUserFieldServiceReportsRemoveEmpty,
  dbUserSaveTimerToStorage,
} from '@services/dexie/user_field_service_reports';
import { dbPublicTalkUpdate } from '@services/dexie/public_talk';
import { dbSongUpdate } from '@services/dexie/songs';
import { dbSourcesUpdateEventsName } from '@services/dexie/sources';
import {
  congAccessCodeState,
  congNameState,
  congNumberState,
  settingsState,
  userLocalUIDState,
} from '@states/settings';
import { schedulesState } from '@states/schedules';
import { sourcesState } from '@states/sources';
import { publicTalksState } from '@states/public_talks';
import { apiPocketValidateMe } from '@services/api/pocket';
import { UserLoginResponseType } from '@definition/api';
import { settingSchema } from '@services/dexie/schema';
import { dbUpcomingEventsCleanup } from '@services/dexie/upcoming_events';
import appDb from '@db/appDb';
import { dbSpeakersCongregationsSetName } from '@services/dexie/speakers_congregations';

/**
 * The assignment history is built from schedules, sources, public talks and
 * settings. Their atoms are fed by live queries, which catch up with the
 * database only after a render, and startup (runUpdater) or a sync may have
 * just rewritten those tables. Read them from the database instead and prime
 * the atoms with the same rows the live queries will deliver.
 */
const primeAssignmentHistorySources = async () => {
  const { settings, schedules, sources, publicTalks } =
    await dbAppGetAssignmentHistorySources();

  if (settings) store.set(settingsState, settings);
  store.set(schedulesState, schedules);
  store.set(sourcesState, sources);
  store.set(publicTalksState, publicTalks);
};

/**
 * Rebuilds the assignment history from what is in the database right now.
 * Used after startup and after a sync, both of which have just written the
 * tables the history is built from. A failed read is not worth keeping the
 * app on its loading screen for, so it falls back to the rows the atoms
 * already hold.
 */
export const buildAssignmentHistory = async () => {
  try {
    await primeAssignmentHistorySources();
  } catch (error) {
    console.error(error);
  }

  const history = schedulesBuildHistoryList();
  setAssignmentsHistory(history);
};

export const loadApp = async () => {
  const appLang = store.get(appLangState);

  handleAppChangeLanguage(appLang);

  await buildAssignmentHistory();
};

export const runUpdater = async () => {
  await dbSongUpdate();
  await dbPublicTalkUpdate();
  await dbWeekTypeUpdate();
  await dbAssignmentUpdate();
  await dbPersonsUpdateAssignments();
  await dbPersonsCleanUp();
  await dbSchedAuxClassUpdate();
  await dbRemoveDuplicateReports();
  await dbMetadataDefault();
  await dbAppSettingsCreatePublishersSort();
  await dbConvertAutoAssignPrayers();
  await dbSchedUpdateOutgoingTalksFields();
  await dbUserFieldServiceReportsRemoveEmpty();
  await dbSourcesUpdateEventsName();
  await dbUserSaveTimerToStorage();
  await dbUpcomingEventsCleanup();
  await dbAppSettingsUpdateCongNumber();
  await dbSpeakersCongregationsSetName();
};

export const userLogoutSuccess = async () => {
  await userSignOut();
  disconnectCongAccount();
  displaySnackNotification({
    header: getTranslation({ key: 'tr_errorTitle' }),
    message: getTranslation({ key: 'logoutSuccess' }),
    severity: 'success',
  });
};

export const handleDeleteDatabase = async () => {
  setRootModalOpen(true);
  await dbAppDelete();
  await userSignOut();

  const freezeKeys = [
    'userConsent',
    'organized_whatsnew',
    'theme',
    'app_font',
    'ui_lang',
  ];

  const storageKeys = Object.keys(localStorage).filter(
    (key) => !freezeKeys.includes(key)
  );

  for (const key of storageKeys) {
    localStorage.removeItem(key);
  }

  window.location.href = './';
};

export const checkPwaUpdate = () => {
  if ('serviceWorker' in navigator) {
    const swUrl = `${import.meta.env.BASE_URL}service-worker.js`;
    navigator.serviceWorker
      .register(swUrl, { updateViaCache: 'none' })
      .then((reg) => {
        reg.update().catch(() => {});
      })
      .catch(() => {});
  }
};

export const getUserDataView = <T extends { type: string }>(
  data: T[],
  dataView: string
) => {
  return data.find((record) => record.type === dataView);
};

const convertBrowserLanguage = () => {
  let found: LanguageItem | undefined;

  const languages = navigator.languages;

  for (const language of languages) {
    found = LANGUAGE_LIST.find((record) =>
      record.browserLangCode?.some(
        (lang) => lang.toLowerCase() === language.toLowerCase()
      )
    );

    if (found) break;
  }

  return found;
};

const setSourceLanguageDefault = async (lang: string) => {
  const settings = await dbAppSettingsGet();

  const sourceLanguages = structuredClone(
    settings.cong_settings.source_material.language
  );

  const main = sourceLanguages.find((record) => record.type === 'main');
  main.value = lang.toUpperCase();
  main.updatedAt = new Date().toISOString();

  await dbAppSettingsUpdateWithoutNotice({
    'cong_settings.source_material.language': sourceLanguages,
  });
};

export const getAppLang = () => {
  let appLang = localStorage?.getItem('ui_lang');

  if (!appLang) {
    const browserLang = convertBrowserLanguage();

    if (browserLang) {
      appLang = browserLang.threeLettersCode;

      // settings source language
      setSourceLanguageDefault(browserLang.code);
    }

    if (!browserLang) {
      appLang = 'eng';
    }

    localStorage?.setItem('ui_lang', appLang);
  }

  store.set(appLangState, appLang);

  return appLang;
};

export const getListLanguages = async () => {
  const settings = await appDb.app_settings.get(1);

  const appLang = getAppLang();

  const appLangCode =
    LANGUAGE_LIST.find((record) => record.threeLettersCode === appLang)?.code ??
    'E';

  const appLangPath =
    LANGUAGE_LIST.find((record) => record.threeLettersCode === appLang)
      ?.locale ?? 'en';

  const languages = [
    { locale: appLang, path: appLangPath, code: appLangCode.toUpperCase() },
  ];

  for (const source of settings.cong_settings.source_material.language) {
    const JWLang = source.value;

    const sourceLang =
      LANGUAGE_LIST.find((record) => record.code.toUpperCase() === JWLang)
        ?.threeLettersCode ?? 'eng';

    const sourceLangPath =
      LANGUAGE_LIST.find((record) => record.threeLettersCode === sourceLang)
        ?.locale ?? 'en';

    if (!languages.some((r) => r.locale === sourceLang)) {
      languages.push({
        locale: sourceLang,
        path: sourceLangPath,
        code: JWLang.toUpperCase(),
      });
    }
  }

  // check source
  if (!languages.some((record) => record.locale === 'eng')) {
    languages.push({ code: 'E', locale: 'eng', path: 'en' });
  }

  return languages;
};

const handleLoadApp = async () => {
  await runUpdater();

  await loadApp();

  store.set(isSetupState, false);
  store.set(offlineOverrideState, false);
  store.set(isAppLoadState, false);
};

const handleUpdateSettings = async (data: UserLoginResponseType) => {
  const { app_settings } = data;

  const settings = store.get(settingsState);

  const midweekMeeting = structuredClone(
    settings.cong_settings.midweek_meeting
  );

  for (const midweekRemote of app_settings.cong_settings.midweek_meeting) {
    const midweekLocal = midweekMeeting.find(
      (record) => record.type === midweekRemote.type
    );

    if (midweekLocal) {
      midweekLocal.time = midweekRemote.time;
      midweekLocal.weekday = midweekRemote.weekday;
    } else {
      midweekMeeting.push({
        ...settingSchema.cong_settings.midweek_meeting.at(0),
        time: midweekRemote.time,
        type: midweekRemote.type,
        weekday: midweekRemote.weekday,
      });
    }
  }

  const weekendMeeting = structuredClone(
    settings.cong_settings.weekend_meeting
  );

  for (const weekendRemote of app_settings.cong_settings.weekend_meeting) {
    const weekendLocal = weekendMeeting.find(
      (record) => record.type === weekendRemote.type
    );

    if (weekendLocal) {
      weekendLocal.time = weekendRemote.time;
      weekendLocal.weekday = weekendRemote.weekday;
    } else {
      weekendMeeting.push({
        ...settingSchema.cong_settings.weekend_meeting.at(0),
        time: weekendRemote.time,
        type: weekendRemote.type,
        weekday: weekendRemote.weekday,
      });
    }
  }

  await dbAppSettingsUpdate({
    'user_settings.account_type': 'pocket',
    'user_settings.user_local_uid': app_settings.user_settings.user_local_uid,
    'user_settings.user_members_delegate':
      app_settings.user_settings.user_members_delegate,
    'cong_settings.country_code': app_settings.cong_settings.country_code,
    'cong_settings.cong_name': app_settings.cong_settings.cong_name,
    'cong_settings.cong_number': app_settings.cong_settings.cong_number,
    'user_settings.cong_role': app_settings.user_settings.cong_role,
    'cong_settings.cong_location': app_settings.cong_settings.cong_location,
    'cong_settings.cong_circuit': app_settings.cong_settings.cong_circuit,
    'cong_settings.midweek_meeting': midweekMeeting,
    'cong_settings.weekend_meeting': weekendMeeting,
  });

  store.set(congAccountConnectedState, true);

  await handleLoadApp();
};

const validatePocket = async () => {
  const { result, status } = await apiPocketValidateMe();

  if (status === 403 || status === 404) {
    await handleDeleteDatabase();
    return;
  }

  if (status !== 200) {
    store.set(isPocketSignUpState, true);
    console.error(result);
    throw new Error(result?.message);
  }

  await handleUpdateSettings(result);
};

export const pocketStartup = async () => {
  const userLocalUID = store.get(userLocalUIDState);
  const congName = store.get(congNameState);
  const congNumber = store.get(congNumberState);
  const accessCode = store.get(congAccessCodeState);

  try {
    if (userLocalUID.length === 0) {
      store.set(isPocketSignUpState, true);
      return;
    }

    const allowOpen =
      congName.length > 0 && congNumber.length > 0 && accessCode.length > 0;

    if (allowOpen) {
      await handleLoadApp();
      return;
    }

    if (navigator.onLine) {
      await validatePocket();
      return;
    }

    store.set(isPocketSignUpState, true);
  } catch (error) {
    console.error(error);

    throw new Error(error?.message);
  }
};

export const buildLocalizeFn = (values: string[]) => {
  return (index: number) => values[index];
};

export const determineAppLocale = (appLang: string) => {
  const monthNames = generateMonthNames(appLang);
  const dayShorts = generateDayCapitalNames(appLang);

  let locale = LANGUAGE_LIST.find(
    (record) => record.threeLettersCode === appLang
  )?.fnsLocale;

  if (!locale) {
    locale = {
      ...enUS,
      code: appLang,
      localize: {
        ...enUS.localize,
        month: buildLocalizeFn(monthNames),
        day: buildLocalizeFn(dayShorts),
      },
    };
  }

  return locale;
};
