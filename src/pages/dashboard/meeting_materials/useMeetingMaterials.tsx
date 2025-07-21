import { useAtomValue } from 'jotai';
import { fileDialog } from 'file-select-dialog';
import { IconError } from '@components/icons';
import { useAppTranslation, useInternetChecker } from '@hooks/index';
import {
  setEpubFile,
  setIsImportEPUB,
  setIsImportJWOrg,
} from '@services/states/sources';
import { displaySnackNotification } from '@services/states/app';
import { JWLangState } from '@states/settings';

const useMeetingMaterials = () => {
  const { t } = useAppTranslation();

  const { isNavigatorOnline } = useInternetChecker();

  const sourceLang = useAtomValue(JWLangState);

  const handleOpenJWImport = () => setIsImportJWOrg(true);

  const handleOpenEPUBFile = async () => {
    try {
      const file = await fileDialog({
        accept: ['.epub', '.jwpub'],
        strict: true,
      });

      const epubLang = file.name.split('_')[1];

      if (epubLang && epubLang === sourceLang.toUpperCase()) {
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
