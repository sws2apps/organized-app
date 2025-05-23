import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import { isImportJWOrgState } from '@states/sources';
import { setIsImportJWOrg } from '@services/states/sources';
import { apiFetchSources } from '@services/api/sources';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { sourcesImportJW } from '@services/app/sources';

const useJWMaterialsImport = () => {
  const { t } = useAppTranslation();

  const isOpen = useAtomValue(isImportJWOrgState);

  const [isCompleted, setIsCompleted] = useState(false);

  const handleClose = () => setIsImportJWOrg(false);

  useEffect(() => {
    const handleRunImport = async () => {
      try {
        const { data, status } = await apiFetchSources();

        if (status === 200) {
          if (data && data.length > 0) {
            await sourcesImportJW(data);
          }

          setIsCompleted(true);
          return;
        }

        displaySnackNotification({
          header: getMessageByCode('error_app_generic-title'),
          message: getMessageByCode(data.message),
          severity: 'error',
        });
      } catch (error) {
        console.error(error);
        setIsImportJWOrg(false);

        displaySnackNotification({
          header: getMessageByCode('error_app_generic-title'),
          message: getMessageByCode(error.message),
          severity: 'error',
        });
      }
    };

    handleRunImport();
  }, [t]);

  return { isOpen, handleClose, isCompleted };
};

export default useJWMaterialsImport;
