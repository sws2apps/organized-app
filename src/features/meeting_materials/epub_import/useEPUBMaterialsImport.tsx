import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import { epubFileState, isImportEPUBState } from '@states/sources';
import { setEpubFile, setIsImportEPUB } from '@services/states/sources';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { sourcesImportEPUB } from '@services/app/sources';

const useEPUBMaterialsImport = () => {
  const { t } = useAppTranslation();

  const isOpen = useAtomValue(isImportEPUBState);
  const epubFile = useAtomValue(epubFileState);

  const [isCompleted, setIsCompleted] = useState(false);

  const handleClose = () => setIsImportEPUB(false);

  useEffect(() => {
    const handleRunImport = async () => {
      try {
        if (epubFile) {
          await sourcesImportEPUB(epubFile);
          setEpubFile(null);
          setIsCompleted(true);
        }
      } catch (error) {
        setEpubFile(null);
        setIsImportEPUB(false);

        displaySnackNotification({
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
