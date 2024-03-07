import { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useAppTranslation } from '@hooks/index';
import { isImportJWOrgState } from '@states/sources';
import { setIsImportJWOrg } from '@services/recoil/sources';
import { apiFetchSources } from '@services/api/sources';
import { displaySnackNotification } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import { addJwDataToDb } from '@services/cpe/sources';

const useJWMaterialsImport = () => {
  const { t } = useAppTranslation();

  const cancel = useRef<boolean>();

  const isOpen = useRecoilValue(isImportJWOrgState);

  const [isCompleted, setIsCompleted] = useState(false);

  const handleAbort = async () => {
    cancel.current = true;
    await setIsImportJWOrg(false);
  };

  useEffect(() => {
    const handleRunImport = async () => {
      try {
        cancel.current = false;

        const { data, status } = await apiFetchSources();

        if (!cancel.current) {
          if (status === 200) {
            if (data && data.length > 0) {
              await addJwDataToDb(data);
            }

            setIsCompleted(true);
            return;
          }

          await displaySnackNotification({
            header: t('tr_errorTitle'),
            message: getMessageByCode(data.message),
            severity: 'error',
          });
        }
      } catch (error) {
        await setIsImportJWOrg(false);

        await displaySnackNotification({
          header: t('tr_errorTitle'),
          message: getMessageByCode(error.message),
          severity: 'error',
        });
      }
    };

    handleRunImport();
  }, [t]);

  return { isOpen, handleAbort, isCompleted };
};

export default useJWMaterialsImport;
