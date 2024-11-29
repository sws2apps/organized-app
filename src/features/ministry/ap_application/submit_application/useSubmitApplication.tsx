import { useMemo, useState } from 'react';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { IconCheckCircle, IconError } from '@components/icons';
import { currentAPFormState } from '@states/ministry';
import { displaySnackNotification } from '@services/recoil/app';
import { useAppTranslation } from '@hooks/index';
import { decryptData, encryptObject } from '@services/encryption';
import { accountTypeState, congAccessCodeState } from '@states/settings';
import { apiUserSubmitApplication, apiValidateMe } from '@services/api/user';
import { APFormOutgoing } from '@definition/api';
import {
  apiPocketSubmitApplication,
  apiPocketValidateMe,
} from '@services/api/pocket';
import { getMessageByCode } from '@services/i18n/translation';

const useSubmitApplication = () => {
  const { t } = useAppTranslation();

  const resetForm = useResetRecoilState(currentAPFormState);

  const formData = useRecoilValue(currentAPFormState);
  const congAccessCode = useRecoilValue(congAccessCodeState);
  const accountType = useRecoilValue(accountTypeState);

  const [isProcessing, setIsProcessing] = useState(false);

  const disabled = useMemo(() => {
    if (formData.months.length === 0) return true;

    if (formData.date === null) return true;

    return false;
  }, [formData]);

  const handleSubmit = async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);

      const application = {
        continuous: formData.continuous,
        months: formData.months,
        submitted: formData.date.toISOString(),
      };

      let accessCode: string;

      if (accountType === 'vip') {
        const { result } = await apiValidateMe();
        accessCode = decryptData(result.cong_access_code, congAccessCode);
      }

      if (accountType === 'pocket') {
        const { result } = await apiPocketValidateMe();
        accessCode = decryptData(
          result.app_settings.cong_settings.cong_access_code,
          congAccessCode
        );
      }

      encryptObject({
        data: application,
        table: 'applications',
        accessCode,
      });

      const payload = application as unknown as APFormOutgoing;

      if (accountType === 'vip') {
        await apiUserSubmitApplication(payload);
      }

      if (accountType === 'pocket') {
        await apiPocketSubmitApplication(payload);
      }

      setIsProcessing(false);
      resetForm();

      await displaySnackNotification({
        header: t('tr_applicationSubmitted'),
        message: t('tr_applicationSubmittedDesc'),
        severity: 'success',
        icon: <IconCheckCircle color="var(--white)" />,
      });
    } catch (error) {
      setIsProcessing(false);

      console.error(error);

      await displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: error.message,
        severity: 'error',
        icon: <IconError color="var(--white)" />,
      });
    }
  };

  return { disabled, handleSubmit, isProcessing };
};

export default useSubmitApplication;
