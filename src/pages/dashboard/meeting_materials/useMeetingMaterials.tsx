import { useRecoilValue } from 'recoil';
import { fileDialog } from 'file-select-dialog';
import { useAppTranslation, useInternetChecker } from '@hooks/index';
import {
  setEpubFile,
  setIsImportEPUB,
  setIsImportJWOrg,
} from '@services/recoil/sources';
import { displaySnackNotification } from '@services/recoil/app';
import { appLangState } from '@states/app';
import { LANGUAGE_LIST } from '@constants/index';
import { IconError } from '@components/icons';

const useMeetingMaterials = () => {
  const { t } = useAppTranslation();

  const { isNavigatorOnline } = useInternetChecker();

  const appLang = useRecoilValue(appLangState);

  const handleOpenJWImport = async () => {
    await setIsImportJWOrg(true);
  };

  const handleOpenEPUBFile = async () => {
    try {
      const file = await fileDialog({
        accept: '.epub',
        strict: true,
      });

      const epubLang = file.name.split('_')[1];
      const codeLang = LANGUAGE_LIST.find(
        (lang) => lang.locale === appLang
      ).code;

      if (epubLang && epubLang === codeLang.toUpperCase()) {
        await setEpubFile(file);
        await setIsImportEPUB(true);
      } else {
        await displaySnackNotification({
          header: t('tr_EPUBImportFailed'),
          message: t('tr_EPUBImportFailedDesc'),
          severity: 'error',
          icon: <IconError color="var(--always-white)" />,
        });
      }
    } catch (error) {
      console.error(error);
      await displaySnackNotification({
        header: t('tr_EPUBImportFailed'),
        message: t('tr_EPUBImportFailedDesc'),
        severity: 'error',
        icon: <IconError color="var(--always-white)" />,
      });
    }
  };

  return { handleOpenJWImport, isNavigatorOnline, handleOpenEPUBFile };
};

export default useMeetingMaterials;
