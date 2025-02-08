import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import {
  JWLangState,
  settingsState,
  userDataViewState,
} from '@states/settings';
import { isTest, LANGUAGE_LIST, STORAGE_KEY } from '@constants/index';
import { dbAppSettingsUpdate } from '@services/dexie/settings';

const useSourceLanguage = () => {
  const value = useRecoilValue(JWLangState);
  const dataView = useRecoilValue(userDataViewState);
  const settings = useRecoilValue(settingsState);

  const SOURCE_LANGUAGES = useMemo(() => {
    return LANGUAGE_LIST.filter((record) => record.source);
  }, []);

  const value_fullname = useMemo(() => {
    return (
      SOURCE_LANGUAGES.find((record) => record.code.toUpperCase() === value)
        ?.name || ''
    );
  }, [value, SOURCE_LANGUAGES]);

  const handleChangeLanguage = async (value: string) => {
    try {
      const updateSourceLanguage = structuredClone(
        settings.cong_settings.source_material.language
      );

      const currentLanguage = updateSourceLanguage.find(
        (record) => record.type === dataView
      );

      if (currentLanguage) {
        currentLanguage.value = value;
        currentLanguage.updatedAt = new Date().toISOString();
      }

      if (!currentLanguage) {
        updateSourceLanguage.push({
          type: 'main',
          value,
          updatedAt: new Date().toISOString(),
        });
      }

      await dbAppSettingsUpdate({
        'cong_settings.source_material.language': updateSourceLanguage,
      });

      if (isTest) {
        localStorage.setItem('demo_source_language', value);
      }

      localStorage.removeItem(STORAGE_KEY.source_import);

      location.href = '/';
    } catch (error) {
      console.error(error);
    }
  };

  return { SOURCE_LANGUAGES, value, handleChangeLanguage, value_fullname };
};

export default useSourceLanguage;
