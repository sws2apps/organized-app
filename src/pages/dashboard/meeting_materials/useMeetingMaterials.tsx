import { useAtomValue } from 'jotai';
import { fileDialog } from 'file-select-dialog';
import { useAppTranslation, useInternetChecker } from '@hooks/index';
import {
  setEpubFile,
  setIsImportEPUB,
  setIsImportJWOrg,
} from '@services/states/sources';
import { displaySnackNotification } from '@services/states/app';
import { appLangState } from '@states/app';
import { LANGUAGE_LIST } from '@constants/index';
import { IconError } from '@components/icons';

const useMeetingMaterials = () => {
  const { t } = useAppTranslation();

  const { isNavigatorOnline } = useInternetChecker();

  const appLang = useAtomValue(appLangState);

  const handleOpenJWImport = () => setIsImportJWOrg(true);

  const handleOpenEPUBFile = async () => {
    try {
      const file = await fileDialog({
        accept: ['.epub', '.jwpub'],
        strict: true,
      });

      const epubLang = file.name.split('_')[1];
      const codeLang = LANGUAGE_LIST.find(
        (lang) => lang.locale === appLang
      ).code;

      if (epubLang && epubLang === codeLang.toUpperCase()) {
        setEpubFile(file);
        setIsImportEPUB(true);
      } else {
        displaySnackNotification({
          header: t('tr_EPUBImportFailed'),
          message: t('tr_EPUBImportFailedDesc'),
          severity: 'error',
          icon: <IconError color="var(--always-white)" />,
        });
      }
    } catch (error) {
      console.error(error);
      displaySnackNotification({
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
