import { useEffect, useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useBreakpoints } from '@hooks/index';
import {
  appFontState,
  appLangState,
  appLocaleState,
  isAppLoadState,
  navBarAnchorElState,
} from '@states/app';
import { LANGUAGE_LIST } from '@constants/index';
import { getTranslation } from '@services/i18n/translation';
import { FullnameOption } from '@definition/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { settingsState, userDataViewState } from '@states/settings';
import i18n, { refreshLocalesResources } from '@services/i18n';
import { dbAssignmentUpdate } from '@services/dexie/assignment';
import { dbPublicTalkUpdate } from '@services/dexie/public_talk';
import { dbSongUpdate } from '@services/dexie/songs';
import { schedulesBuildHistoryList } from '@services/app/schedules';
import { setAssignmentsHistory } from '@services/states/schedules';
import { dbWeekTypeUpdate } from '@services/dexie/weekType';
import { determineAppLocale } from '@services/app';

const useLanguage = () => {
  const { tabletDown } = useBreakpoints();

  const [appLang, setAppLang] = useAtom(appLangState);

  const setAppFont = useSetAtom(appFontState);
  const setNavBarAnchorEl = useSetAtom(navBarAnchorElState);
  const setAppLocale = useSetAtom(appLocaleState);

  const isAppLoad = useAtomValue(isAppLoadState);
  const dataView = useAtomValue(userDataViewState);
  const settings = useAtomValue(settingsState);

  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleUpdateLangDb = async () => {
    await refreshLocalesResources();
    await dbWeekTypeUpdate();
    await dbAssignmentUpdate();
    await dbPublicTalkUpdate();
    await dbSongUpdate();
  };

  const handleUpdateLocale = (appLang: string) => {
    const locale = determineAppLocale(appLang);
    setAppLocale(locale);
  };

  const handleLangChange = async (ui_lang: string) => {
    handleClose();

    const findLanguage = LANGUAGE_LIST.find(
      (record) => record.threeLettersCode === ui_lang
    );

    const fullnameOption =
      findLanguage?.fullnameOption || FullnameOption.FIRST_BEFORE_LAST;

    const nameOption = structuredClone(settings.cong_settings.fullname_option);
    const current = nameOption.find((record) => record.type === dataView);

    if (current) {
      current.value = fullnameOption;
      current.updatedAt = new Date().toISOString();
    } else {
      nameOption.push({
        _deleted: false,
        type: dataView,
        value: fullnameOption,
        updatedAt: new Date().toISOString(),
      });
    }

    const sourceLanguage = structuredClone(
      settings.cong_settings.source_material.language
    );

    if (isAppLoad) {
      const findSource = sourceLanguage.find(
        (record) => record.type === dataView
      );

      if (findSource) {
        findSource.value = findLanguage?.code.toUpperCase() || 'E';
        findSource.updatedAt = new Date().toISOString();
      }
    }

    await dbAppSettingsUpdate({
      'cong_settings.fullname_option': nameOption,
      'cong_settings.source_material.language': sourceLanguage,
    });

    const font =
      LANGUAGE_LIST.find((lang) => lang.threeLettersCode === ui_lang)?.font ||
      'Inter';

    localStorage.setItem('ui_lang', ui_lang);

    setAppFont(font);
    setAppLang(ui_lang);

    await handleUpdateLangDb();

    await i18n.changeLanguage(ui_lang);

    handleUpdateLocale(ui_lang);

    // load assignment history
    const history = schedulesBuildHistoryList();
    setAssignmentsHistory(history);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setNavBarAnchorEl(null);
  };

  const handleLocalizeOpen = () => {
    handleClose();
  };

  useEffect(() => {
    const isoLang = getTranslation({ key: 'tr_iso' });
    document.documentElement.setAttribute('lang', isoLang);
  }, []);

  useEffect(() => {
    const direction =
      LANGUAGE_LIST.find((lang) => lang.threeLettersCode === appLang)
        ?.direction || 'ltr';

    document.documentElement.setAttribute('dir', direction);
  }, [appLang]);

  return {
    handleClick,
    anchorEl,
    isMenuOpen,
    handleClose,
    LANGUAGE_LIST,
    handleLocalizeOpen,
    handleLangChange,
    tabletDown,
    isAppLoad,
  };
};

export default useLanguage;
