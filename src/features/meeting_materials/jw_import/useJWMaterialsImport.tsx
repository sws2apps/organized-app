import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useAppTranslation } from '@hooks/index';
import { isImportJWOrgState } from '@states/sources';
import { setIsImportJWOrg } from '@services/recoil/sources';
import { apiFetchSources } from '@services/api/sources';
import { displaySnackNotification } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import { sourcesImportJW } from '@services/app/sources';

const useJWMaterialsImport = () => {
  const { t } = useAppTranslation();

  const isOpen = useRecoilValue(isImportJWOrgState);

  const [isCompleted, setIsCompleted] = useState(false);

  const handleClose = async () => {
    await setIsImportJWOrg(false);
  };

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

        await displaySnackNotification({
          header: getMessageByCode('error_app_generic-title'),
          message: getMessageByCode(data.message),
          severity: 'error',
        });
      } catch (error) {
        console.error(error);
        await setIsImportJWOrg(false);

        await displaySnackNotification({
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
