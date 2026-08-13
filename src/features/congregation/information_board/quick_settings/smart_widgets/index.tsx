import SwitchWithLabel from '@components/switch_with_label';
import Typography from '@components/typography';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { Stack } from '@mui/material';
import useInforBoardQSSmartWidgets from './useInfoBoardQSSmartWidgets';
import { InfoBoardGeneralInformationDraftProps } from '../index.types';

const InfoBoardQSSmartWidgets = (
  props: InfoBoardGeneralInformationDraftProps
) => {
  const {
    meetingTimes,
    // videoconferenceInfo,
    auxiliaryPioneers,
    monthsOfSpecialActivity,
    handleSmartWidgetToggle,
    pioneersIsExist,
    noMonths,
  } = useInforBoardQSSmartWidgets(props);

  const { t } = useAppTranslation();
  const { isAdmin } = useCurrentUser();

  return (
    <Stack spacing={'16px'}>
      <Typography className="body-regular" color="var(--grey-400)">
        {t('tr_infoBoardQuickSettingsSWDescription')}
      </Typography>
      <SwitchWithLabel
        readOnly={!isAdmin}
        label={t('tr_meetingTimes')}
        helper={t('tr_meetingTimesDesc')}
        checked={meetingTimes}
        onChange={() => handleSmartWidgetToggle('meeting_times')}
      />
      {/* <SwitchWithLabel
        readOnly={!isAdmin}
        label={t('tr_videoconferenceInfo')}
        helper={t('tr_videoconferenceInfoDesc')}
        checked={videoconferenceInfo}
        onChange={() => handleSmartWidgetToggle('videoconference_info')}
      /> */}
      <SwitchWithLabel
        readOnly={!isAdmin || !pioneersIsExist}
        label={t('tr_APs')}
        helper={t('tr_auxiliaryPioneersDesc')}
        checked={pioneersIsExist && auxiliaryPioneers}
        onChange={() => handleSmartWidgetToggle('auxiliary_pioneers')}
      />
      <SwitchWithLabel
        readOnly={!isAdmin || noMonths}
        label={t('tr_monthsOfSpecialActivity')}
        helper={t('tr_monthsOfSpecialActivityDesc')}
        checked={!noMonths && monthsOfSpecialActivity}
        onChange={() => handleSmartWidgetToggle('months_of_special_activity')}
      />
    </Stack>
  );
};

export default InfoBoardQSSmartWidgets;
