import { useMemo, useState } from 'react';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { IconCheckCircle, IconError } from '@components/icons';
import { currentAPFormState } from '@states/ministry';
import { displaySnackNotification } from '@services/recoil/app';
import { useAppTranslation } from '@hooks/index';
import { decryptData, encryptObject } from '@services/encryption';
import { congAccessCodeState } from '@states/settings';
import { apiUserSubmitApplication, apiValidateMe } from '@services/api/user';
import { APFormOutgoing } from '@definition/api';

const useSubmitApplication = () => {
  const { t } = useAppTranslation();

  const resetForm = useResetRecoilState(currentAPFormState);

  const formData = useRecoilValue(currentAPFormState);
  const congAccessCode = useRecoilValue(congAccessCodeState);

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

      const { result } = await apiValidateMe();
      const accessCode = decryptData(result.cong_access_code, congAccessCode);

      encryptObject({
        data: application,
        table: 'applications',
        accessCode,
      });

      const payload = application as unknown as APFormOutgoing;

      await apiUserSubmitApplication(payload);

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
        header: t('tr_errorTitle'),
        message: error.message,
        severity: 'error',
        icon: <IconError color="var(--white)" />,
      });
    }
  };

  return { disabled, handleSubmit, isProcessing };
};

export default useSubmitApplication;
