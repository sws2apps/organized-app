import { MouseEvent, useRef, useState } from 'react';
import useAppTranslation from '@hooks/useAppTranslation';
import { schedulesStartAutofill } from '@services/app/autofill';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';

const useWeekBadge = (week?: string) => {
  const { t } = useAppTranslation();

  const [isProcessing, setIsProcessing] = useState(false);

  const isProcessingRef = useRef(false);

  const handleAutofill = async (e: MouseEvent) => {
    e.stopPropagation();

    if (!week || isProcessingRef.current) return;

    isProcessingRef.current = true;
    setIsProcessing(true);

    try {
      const weeksFilled = await schedulesStartAutofill(week, week, 'midweek');

      if (weeksFilled === 0) {
        displaySnackNotification({
          header: t('tr_autofillNoMaterial'),
          message: t('tr_autofillNoMaterialDesc'),
          severity: 'error',
        });
      }
    } catch (error) {
      console.error(error);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode('error_app_generic-desc'),
        severity: 'error',
      });
    } finally {
      isProcessingRef.current = false;
      setIsProcessing(false);
    }
  };

  return { isProcessing, handleAutofill };
};

export default useWeekBadge;
