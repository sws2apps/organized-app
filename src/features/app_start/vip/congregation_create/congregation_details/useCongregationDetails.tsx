import { useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useAppTranslation } from '@hooks/index';
import {
  setCongID,
  setUserID,
  displayOnboardingFeedback,
  setIsNewCongregation,
} from '@services/recoil/app';
import { settingsState } from '@states/settings';
import { apiCreateCongregation } from '@services/api/congregation';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { getMessageByCode } from '@services/i18n/translation';
import { CongregationCreateResponseType } from '@definition/api';
import { CountryType } from '@components/country_selector/index.types';
import useFeedback from '@features/app_start/shared/hooks/useFeedback';
import worker from '@services/worker/backupWorker';
import { congregationCreateStepState } from '@states/app';

const useCongregationDetails = () => {
  const { t } = useAppTranslation();

  const { hideMessage, message, showMessage, title, variant } = useFeedback();

  const setCurrentStep = useSetRecoilState(congregationCreateStepState);

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
          title: t('error_app_generic-title'),
          message: getMessageByCode(data.message),
        });
        showMessage();

        setIsProcessing(false);
        return;
      }

      if (status === 404) {
        await displayOnboardingFeedback({
          title: t('error_app_generic-title'),
          message: t('tr_congregationExists'),
        });
        showMessage();

        setIsProcessing(false);
        return;
      }

      const result = data as CongregationCreateResponseType;

      setCongID(result.cong_id);
      worker.postMessage({ field: 'congID', value: result.cong_id });

      const midweekMeeting = structuredClone(
        settings.cong_settings.midweek_meeting
      );

      for (const midweekRemote of result.cong_settings.midweek_meeting) {
        const midweekLocal = midweekMeeting.find(
          (record) => record.type === midweekRemote.type
        );

        midweekLocal.time = midweekRemote.time;
        midweekLocal.weekday = midweekRemote.weekday;
      }

      const weekendMeeting = structuredClone(
        settings.cong_settings.weekend_meeting
      );

      for (const weekendRemote of result.cong_settings.weekend_meeting) {
        const weekendLocal = weekendMeeting.find(
          (record) => record.type === weekendRemote.type
        );

        weekendLocal.time = weekendRemote.time;
        weekendLocal.weekday = weekendRemote.weekday;
      }

      await dbAppSettingsUpdate({
        'cong_settings.country_code': result.cong_settings.country_code,
        'cong_settings.cong_name': result.cong_settings.cong_name,
        'cong_settings.cong_number': result.cong_settings.cong_number,
        'user_settings.cong_role': ['admin'],
        'cong_settings.cong_location': result.cong_settings.cong_location,
        'cong_settings.cong_circuit': result.cong_settings.cong_circuit,
        'cong_settings.midweek_meeting': midweekMeeting,
        'cong_settings.weekend_meeting': weekendMeeting,
        'cong_settings.cong_new': true,
      });

      await setIsNewCongregation(true);

      setUserID(result.user_id);

      setCurrentStep(1);
    } catch (err) {
      setIsProcessing(false);

      console.error(err);

      await displayOnboardingFeedback({
        title: t('error_app_generic-title'),
        message: getMessageByCode(err.message),
      });
      showMessage();
    }
  };

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

export default useCongregationDetails;
