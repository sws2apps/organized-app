import { useRecoilValue } from 'recoil';
import {
  JWLangState,
  settingsState,
  userDataViewState,
} from '@states/settings';
import { isTest, STORAGE_KEY } from '@constants/index';
import { dbAppSettingsUpdate } from '@services/dexie/settings';

const useSourceLanguage = () => {
  const value = useRecoilValue(JWLangState);
  const dataView = useRecoilValue(userDataViewState);
  const settings = useRecoilValue(settingsState);

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

  return { value, handleChangeLanguage };
};

export default useSourceLanguage;
