import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useAppTranslation } from '@hooks/index';
import { epubFileState, isImportEPUBState } from '@states/sources';
import { setEpubFile, setIsImportEPUB } from '@services/recoil/sources';
import { displaySnackNotification } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import { sourcesImportEPUB } from '@services/app/sources';

const useEPUBMaterialsImport = () => {
  const { t } = useAppTranslation();

  const isOpen = useRecoilValue(isImportEPUBState);
  const epubFile = useRecoilValue(epubFileState);

  const [isCompleted, setIsCompleted] = useState(false);

  const handleClose = async () => {
    await setIsImportEPUB(false);
  };

  useEffect(() => {
    const handleRunImport = async () => {
      try {
        if (epubFile) {
          await sourcesImportEPUB(epubFile);
          await setEpubFile(null);
          setIsCompleted(true);
        }
      } catch (error) {
        await setEpubFile(null);
        await setIsImportEPUB(false);

        await displaySnackNotification({
          header: getMessageByCode('error_app_generic-title'),
          message: getMessageByCode(error.message),
          severity: 'error',
        });
      }
    };

    handleRunImport();
  }, [t, epubFile]);

  return { isOpen, handleClose, isCompleted };
};

export default useEPUBMaterialsImport;
