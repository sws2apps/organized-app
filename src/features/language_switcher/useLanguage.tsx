import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { useBreakpoints } from '@hooks/index';
import { isAppLoadState } from '@states/app';
import { LANGUAGE_LIST } from '@constants/index';
import { getTranslation } from '@services/i18n/translation';
import { FullnameOption } from '@definition/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { settingsState, userDataViewState } from '@states/settings';

const useLanguage = () => {
  const { tabletDown } = useBreakpoints();

  const isAppLoad = useAtomValue(isAppLoadState);
  const dataView = useAtomValue(userDataViewState);
  const settings = useAtomValue(settingsState);

  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleLangChange = async (ui_lang: string) => {
    const findLanguage = LANGUAGE_LIST.find(
      (record) => record.locale === ui_lang
    );

    const fullnameOption =
      findLanguage?.fullnameOption || FullnameOption.FIRST_BEFORE_LAST;

    const nameOption = structuredClone(settings.cong_settings.fullname_option);
    const current = nameOption.find((record) => record.type === dataView);

    current.value = fullnameOption;
    current.updatedAt = new Date().toISOString();

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
      LANGUAGE_LIST.find((lang) => lang.locale === ui_lang)?.font || 'Inter';

    localStorage.setItem('ui_lang', ui_lang);
    localStorage.setItem('app_font', font);

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
