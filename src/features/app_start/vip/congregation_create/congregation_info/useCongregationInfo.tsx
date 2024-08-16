import { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useAppTranslation } from '@hooks/index';
import {
  setCongID,
  setUserID,
  displayOnboardingFeedback,
  setIsNewCongregation,
  setIsEncryptionCodeOpen,
  setIsCongAccountCreate,
} from '@services/recoil/app';
import { settingsState } from '@states/settings';
import { apiCreateCongregation } from '@services/api/congregation';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { getMessageByCode } from '@services/i18n/translation';
import { CongregationCreateResponseType } from '@definition/api';
import { CountryType } from '@components/country_selector/index.types';
import useFeedback from '@features/app_start/shared/hooks/useFeedback';
import worker from '@services/worker/backupWorker';

const useCongregationInfo = () => {
  const cancel = useRef<boolean>();

  const { t } = useAppTranslation();

  const { hideMessage, message, showMessage, title, variant } = useFeedback();

  const settings = useRecoilValue(settingsState);

  const [isProcessing, setIsProcessing] = useState(false);
  const [country, setCountry] = useState<CountryType>(null);
  const [congregation, setCongregation] = useState(null);
  const [userTmpFirstName, setUserTmpFirstName] = useState(
    settings.user_settings.firstname.value
  );
  const [userTmpLastName, setUserTmpLastName] = useState(
    settings.user_settings.lastname.value
  );
  const [isElderApproved, setIsElderApproved] = useState(false);

  const handleToggleApproval = (value: boolean) => {
    setIsElderApproved(value);
  };

  const handleCongregationAction = async () => {
    if (isProcessing) return;

    hideMessage();

    setIsProcessing(true);

    try {
      if (
        userTmpFirstName.length === 0 ||
        country === null ||
        congregation === null
      ) {
        await displayOnboardingFeedback({
          title: t('tr_missingInfo'),
          message: t('tr_incompleteCongregationInfo'),
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
          title: t('tr_errorGeneric'),
          message: getMessageByCode(data.message),
        });
        showMessage();

        setIsProcessing(false);
        return;
      }

      if (status === 404) {
        await displayOnboardingFeedback({
          title: t('tr_errorGeneric'),
          message: t('tr_congregationExists'),
        });
        showMessage();

        setIsProcessing(false);
        return;
      }

      if (status === 200) {
        const result = data as CongregationCreateResponseType;

        setCongID(result.cong_id);
        worker.postMessage({ field: 'congID', value: result.cong_id });

        const congCircuit = structuredClone(
          settings.cong_settings.cong_circuit
        );

        for (const circuitRemote of result.cong_circuit) {
          const circuitLocal = congCircuit.find(
            (record) => record.type === circuitRemote.type
          );

          circuitLocal.value = circuitRemote.value;
          circuitLocal.updatedAt = circuitRemote.updatedAt;
        }

        const midweekMeeting = structuredClone(
          settings.cong_settings.midweek_meeting
        );

        for (const midweekRemote of result.midweek_meeting) {
          const midweekLocal = midweekMeeting.find(
            (record) => record.type === midweekRemote.type
          );

          midweekLocal.time = midweekRemote.time;
          midweekLocal.weekday = midweekRemote.weekday;
        }

        const weekendMeeting = structuredClone(
          settings.cong_settings.weekend_meeting
        );

        for (const weekendRemote of result.weekend_meeting) {
          const weekendLocal = weekendMeeting.find(
            (record) => record.type === weekendRemote.type
          );

          weekendLocal.time = weekendRemote.time;
          weekendLocal.weekday = weekendRemote.weekday;
        }

        await dbAppSettingsUpdate({
          'cong_settings.country_code': result.country_code,
          'cong_settings.cong_name': result.cong_name,
          'cong_settings.cong_number': result.cong_number,
          'user_settings.cong_role': result.cong_role,
          'cong_settings.cong_location': result.cong_location,
          'cong_settings.cong_circuit': congCircuit,
          'cong_settings.midweek_meeting': midweekMeeting,
          'cong_settings.weekend_meeting': weekendMeeting,
        });

        await setIsNewCongregation(true);

        setUserID(result.id);

        setIsCongAccountCreate(false);
        setIsEncryptionCodeOpen(true);
      }
    } catch (err) {
      if (!cancel.current) {
        await displayOnboardingFeedback({
          title: t('tr_errorGeneric'),
          message: getMessageByCode(err.message),
        });
        showMessage();

        setIsProcessing(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (cancel) {
        cancel.current = true;
      }
    };
  }, []);

  return {
    country,
    userTmpFirstName,
    userTmpLastName,
    isProcessing,
    handleCongregationAction,
    setCongregation,
    setCountry,
    setUserTmpFirstName,
    setUserTmpLastName,
    message,
    title,
    hideMessage,
    variant,
    handleToggleApproval,
    isElderApproved,
    congregation,
  };
};

export default useCongregationInfo;
