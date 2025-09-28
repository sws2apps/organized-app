import { useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import {
  setUserID,
  displayOnboardingFeedback,
  setIsNewCongregation,
} from '@services/states/app';
import { settingsState } from '@states/settings';
import { apiCreateCongregation } from '@services/api/congregation';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { getMessageByCode } from '@services/i18n/translation';
import {
  CongregationCreateResponseType,
  CongregationResponseType,
} from '@definition/api';
import { CountryType } from '@components/country_selector/index.types';
import { congregationCreateStepState } from '@states/app';
import { settingSchema } from '@services/dexie/schema';
import useFeedback from '@features/app_start/shared/hooks/useFeedback';

const useCongregationDetails = () => {
  const { t } = useAppTranslation();

  const { hideMessage, message, showMessage, title, variant } = useFeedback();

  const setCurrentStep = useSetAtom(congregationCreateStepState);

  const settings = useAtomValue(settingsState);

  const [isProcessing, setIsProcessing] = useState(false);
  const [country, setCountry] = useState<CountryType>(null);
  const [congregation, setCongregation] =
    useState<CongregationResponseType>(null);
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
        displayOnboardingFeedback({
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
        country.guid,
        congregation.congName,
        userTmpFirstName,
        userTmpLastName
      );

      if (status !== 200 && status !== 404) {
        displayOnboardingFeedback({
          title: t('error_app_generic-title'),
          message: getMessageByCode(data.message),
        });
        showMessage();

        setIsProcessing(false);
        return;
      }

      if (status === 404) {
        displayOnboardingFeedback({
          title: t('error_app_generic-title'),
          message: t('tr_congregationExists'),
        });
        showMessage();

        setIsProcessing(false);
        return;
      }

      const result = data as CongregationCreateResponseType;

      const midweekMeeting = structuredClone(
        settings.cong_settings.midweek_meeting
      );

      for (const midweekRemote of result.cong_settings.midweek_meeting) {
        const midweekLocal = midweekMeeting.find(
          (record) => record.type === midweekRemote.type
        );

        if (midweekLocal) {
          midweekLocal.time = midweekRemote.time;
          midweekLocal.weekday = midweekRemote.weekday;
        } else {
          midweekMeeting.push({
            ...settingSchema.cong_settings.midweek_meeting.at(0),
            time: midweekRemote.time,
            type: midweekRemote.type,
            weekday: midweekRemote.weekday,
          });
        }
      }

      const weekendMeeting = structuredClone(
        settings.cong_settings.weekend_meeting
      );

      for (const weekendRemote of result.cong_settings.weekend_meeting) {
        const weekendLocal = weekendMeeting.find(
          (record) => record.type === weekendRemote.type
        );

        if (weekendLocal) {
          weekendLocal.time = weekendRemote.time;
          weekendLocal.weekday = weekendRemote.weekday;
        } else {
          weekendMeeting.push({
            ...settingSchema.cong_settings.weekend_meeting.at(0),
            time: weekendRemote.time,
            type: weekendRemote.type,
            weekday: weekendRemote.weekday,
          });
        }
      }

      await dbAppSettingsUpdate({
        'cong_settings.country_code': result.cong_settings.country_code,
        'cong_settings.cong_id': result.cong_id,
        'cong_settings.cong_name': result.cong_settings.cong_name,
        'user_settings.cong_role': ['admin'],
        'cong_settings.cong_location': result.cong_settings.cong_location,
        'cong_settings.cong_circuit': result.cong_settings.cong_circuit,
        'cong_settings.midweek_meeting': midweekMeeting,
        'cong_settings.weekend_meeting': weekendMeeting,
        'cong_settings.cong_new': true,
      });

      setIsNewCongregation(true);

      setUserID(result.user_id);

      setCurrentStep(1);
    } catch (err) {
      setIsProcessing(false);

      console.error(err);

      displayOnboardingFeedback({
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
