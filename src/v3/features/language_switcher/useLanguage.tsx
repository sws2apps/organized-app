import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { appLangState, isAppLoadState } from '@states/app';
import { LANGUAGE_LIST } from '@constants/index';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { getTranslation } from '@services/i18n/translation';

const useLanguage = () => {
  const { i18n } = useAppTranslation();

  const { tabletDown } = useBreakpoints();

  const [appLang, setAppLang] = useRecoilState(appLangState);

  const isAppLoad = useRecoilValue(isAppLoadState);

  const [anchorEl, setAnchorEl] = useState(null);
  const [appLangLocal, setAppLangLocal] = useState(appLang);
  const [userChange, setUserChange] = useState(false);

  const isMenuOpen = Boolean(anchorEl);

  const handleLangChange = async (e) => {
    setUserChange(true);
    const app_lang = e.target.parentElement.parentElement.dataset.code;
    setAppLangLocal(app_lang);

    await dbAppSettingsUpdate({ source_lang: app_lang });

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

        const font = LANGUAGE_LIST.find((lang) => lang.locale === appLangLocal).font || 'Inter';
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
