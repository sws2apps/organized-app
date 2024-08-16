import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { appLangState, isAppLoadState } from '@states/app';
import { LANGUAGE_LIST } from '@constants/index';
import { getTranslation } from '@services/i18n/translation';
import { FullnameOption } from '@definition/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { settingsState, userDataViewState } from '@states/settings';

const useLanguage = () => {
  const { i18n } = useAppTranslation();

  const { tabletDown } = useBreakpoints();

  const [appLang, setAppLang] = useRecoilState(appLangState);

  const isAppLoad = useRecoilValue(isAppLoadState);
  const dataView = useRecoilValue(userDataViewState);
  const settings = useRecoilValue(settingsState);

  const [anchorEl, setAnchorEl] = useState(null);
  const [appLangLocal, setAppLangLocal] = useState(appLang);
  const [userChange, setUserChange] = useState(false);

  const isMenuOpen = Boolean(anchorEl);

  const handleLangChange = async (app_lang: string) => {
    setUserChange(true);
    setAppLangLocal(app_lang);

    const fullnameOption =
      LANGUAGE_LIST.find((record) => record.locale === app_lang)
        .fullnameOption || FullnameOption.FIRST_BEFORE_LAST;

    const nameOption = structuredClone(settings.cong_settings.fullname_option);
    const current = nameOption.find((record) => record.type === dataView);

    current.value = fullnameOption;
    current.updatedAt = new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.fullname_option': nameOption,
    });

    handleClose();
    window.location.reload();
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLocalizeOpen = () => {
    handleClose();
  };

  useEffect(() => {
    const updateLang = async () => {
      if (userChange) {
        await i18n.changeLanguage(appLangLocal);

        const isoLang = getTranslation({ key: 'tr_iso' });
        document.documentElement.setAttribute('lang', isoLang);

        setAppLang(appLangLocal);

        const font =
          LANGUAGE_LIST.find((lang) => lang.locale === appLangLocal)?.font ||
          'Inter';
        localStorage.setItem('app_lang', appLangLocal);
        localStorage.setItem('app_font', font);

        setUserChange(false);
      } else {
        const appLang = localStorage.getItem('app_lang') || 'en';
        await i18n.changeLanguage(appLang);

        const isoLang = getTranslation({ key: 'tr_iso' });
        document.documentElement.setAttribute('lang', isoLang);

        setAppLang(appLang);
      }
    };

    updateLang();
  }, [appLangLocal, i18n, setAppLang, userChange]);

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
