import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { useBreakpoints } from '@hooks/index';
import { cookiesConsentState, isAppLoadState } from '@states/app';
import { LANGUAGE_LIST } from '@constants/index';
import { getTranslation } from '@services/i18n/translation';
import { FullnameOption } from '@definition/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import {
  accountTypeState,
  settingsState,
  userDataViewState,
} from '@states/settings';

const useLanguage = () => {
  const { tabletDown } = useBreakpoints();

  const [, setParams] = useSearchParams();

  const isAppLoad = useRecoilValue(isAppLoadState);
  const dataView = useRecoilValue(userDataViewState);
  const settings = useRecoilValue(settingsState);
  const cookiesConsent = useRecoilValue(cookiesConsentState);
  const accountType = useRecoilValue(accountTypeState);

  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleLangChange = async (app_lang: string) => {
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

    const font =
      LANGUAGE_LIST.find((lang) => lang.locale === app_lang)?.font || 'Inter';

    if (cookiesConsent || accountType === 'pocket') {
      localStorage.setItem('app_lang', app_lang);
      localStorage.setItem('app_font', font);
    }

    if (!cookiesConsent && accountType !== 'pocket') {
      setParams((params) => {
        params.set('locale', app_lang);
        params.set('font', font);
        return params;
      });
    }

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
    const isoLang = getTranslation({ key: 'tr_iso' });
    document.documentElement.setAttribute('lang', isoLang);
  }, []);

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
