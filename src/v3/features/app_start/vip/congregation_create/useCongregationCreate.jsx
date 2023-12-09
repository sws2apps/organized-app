import { useEffect, useRef, useState } from 'react';
import backupWorkerInstance from '@services/worker/backupWorker';
import { useAppTranslation, useFirebaseAuth } from '@hooks';
import {
  setCongID,
  setUserID,
  displayOnboardingFeedback,
  setIsNewCongregation,
  setIsEncryptionCodeOpen,
  setIsCongAccountCreate,
} from '@services/recoil/app';
import { apiCreateCongregation } from '@services/api/congregation';
import { handleUpdateSetting } from '@services/dexie/settings';
import { useFeedback } from '@features/app_start';
import { getMessageByCode } from '@services/i18n/translation';

const useCongregationCreate = () => {
  const cancel = useRef();
  const { user } = useFirebaseAuth();

  const { t } = useAppTranslation();

  const { hideMessage, message, showMessage, title, variant } = useFeedback();

  const [isProcessing, setIsProcessing] = useState(false);
  const [country, setCountry] = useState(null);
  const [congregation, setCongregation] = useState(null);
  const [userTmpFirstName, setUserTmpFirstName] = useState('');
  const [userTmpLastName, setUserTmpLastName] = useState('');
  const [isCreate, setIsCreate] = useState(false);

  const handleCongregationAction = async () => {
    if (isProcessing) return;

    hideMessage();

    setIsProcessing(true);

    try {
      if (userTmpFirstName.length === 0 || country === null || congregation === null) {
        await displayOnboardingFeedback({
          title: t('missingInfo'),
          message: t('incompleteCongregationInfo'),
        });
        showMessage();

        setIsProcessing(false);
        return;
      }

      setIsProcessing(true);

      const { status, data } = await apiCreateCongregation(
        country.code,
        congregation.congName,
        congregation.congNumber,
        userTmpFirstName,
        userTmpLastName
      );

      if (status !== 200 && status !== 404) {
        await displayOnboardingFeedback({
          title: t('errorGeneric'),
          message: getMessageByCode(data.message),
        });
        showMessage();

        setIsProcessing(false);
        return;
      }

      if (status === 404) {
        await displayOnboardingFeedback({
          title: t('errorGeneric'),
          message: t('congregationExists'),
        });
        showMessage();

        setIsProcessing(false);
        return;
      }

      if (status === 200) {
        setCongID(data.cong_id);
        backupWorkerInstance.setCongID(data.cong_id);

        let obj = {};
        obj.username = data.username;
        obj.cong_name = data.cong_name;
        obj.cong_number = data.cong_number;
        obj.user_members_delegate = data.user_members_delegate;
        obj.cong_role = data.cong_role;

        await handleUpdateSetting(obj);
        await setIsNewCongregation(true);

        setUserID(data.id);

        setIsCongAccountCreate(false);
        setIsEncryptionCodeOpen(true);
      }
    } catch (err) {
      if (!cancel.current) {
        await displayOnboardingFeedback({
          title: t('errorGeneric'),
          message: getMessageByCode(err.message),
        });
        showMessage();

        setIsProcessing(false);
      }
    }
  };

  useEffect(() => {
    if (user) {
      let userFullname;

      if (user.displayName && user.displayName !== null) {
        userFullname = user.displayName;
      }

      if (
        user.displayName === null &&
        user.providerData[0]?.displayName &&
        user.providerData[0]?.displayName !== null
      ) {
        userFullname = user.providerData[0].displayName;
      }

      if (userFullname) {
        const names = userFullname.split(' ');
        const lastName = names.pop();
        const firstName = names.join(' ');
        setUserTmpFirstName(firstName);
        setUserTmpLastName(lastName);
      } else {
        setUserTmpFirstName('');
        setUserTmpLastName('');
      }
    }
  }, [user]);

  useEffect(() => {
    return () => {
      cancel.current = true;
    };
  }, []);

  return {
    country,
    congregation,
    userTmpFirstName,
    userTmpLastName,
    isCreate,
    isProcessing,
    handleCongregationAction,
    setIsCreate,
    setCongregation,
    setCountry,
    setUserTmpFirstName,
    setUserTmpLastName,
    message,
    title,
    hideMessage,
    variant,
  };
};

export default useCongregationCreate;
