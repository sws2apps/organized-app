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
  CountryResponseType,
} from '@definition/api';
import { appLangState, congregationCreateStepState } from '@states/app';
import { LANGUAGE_LIST } from '@constants/index';
import { FullnameOption } from '@definition/settings';
import { settingSchema } from '@services/dexie/schema';
import useFeedback from '@features/app_start/shared/hooks/useFeedback';

const useCongregationDetails = () => {
  const { t } = useAppTranslation();

  const { hideMessage, message, showMessage, title, variant } = useFeedback();

  const setCurrentStep = useSetAtom(congregationCreateStepState);

  const settings = useAtomValue(settingsState);
  const appLang = useAtomValue(appLangState);

  const [isProcessing, setIsProcessing] = useState(false);
  const [country, setCountry] = useState<CountryResponseType>(null);
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
        country.countryCode,
        country.countryGuid,
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

      const language = LANGUAGE_LIST.find(
        (record) => record.threeLettersCode === appLang
      );

      const updatedAt = new Date().toISOString();

      const sourceLanguage = structuredClone(
        settings.cong_settings.source_material.language
      );

      const mainSource = sourceLanguage.find(
        (record) => record.type === 'main'
      );

      if (mainSource) {
        mainSource.value = language?.code.toUpperCase() || 'E';
        mainSource.updatedAt = updatedAt;
      }

      const fullnameOption = structuredClone(
        settings.cong_settings.fullname_option
      );

      const mainFullname = fullnameOption.find(
        (record) => record.type === 'main'
      );

      if (mainFullname) {
        mainFullname.value =
          language?.fullnameOption || FullnameOption.FIRST_BEFORE_LAST;
        mainFullname.updatedAt = updatedAt;
      }

      await dbAppSettingsUpdate({
        'cong_settings.source_material.language': sourceLanguage,
        'cong_settings.fullname_option': fullnameOption,
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
