import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { SwitchContainer } from '../shared_styles';
import useUserAdditionalRights from './useUserAdditionalRights';
import useUserDetails from '../useUserDetails';
import SwitchWithLabel from '@components/switch_with_label';
import Typography from '@components/typography';

const UserAdditionalRights = () => {
  const { t } = useAppTranslation();
  const { dutiesEnabled } = useCurrentUser();

  const { isProcessing } = useUserDetails();

  const {
    isMidweek,
    handleToggleMidweek,
    isPublicTalk,
    handleTogglePublicTalk,
    isAttendance,
    handleToggleAttendance,
    isWeekend,
    handleToggleWeekend,
    isDuties,
    handleToggleDuties,
  } = useUserAdditionalRights();

  return (
    <>
      <Typography
        className="h4"
        sx={{
          color: 'var(--grey-400)',
        }}
      >
        {t('tr_additionalUserRights')}
      </Typography>

      <Typography
        className="body-small-semibold"
        sx={{
          color: 'var(--grey-400)',
        }}
      >
        {t('tr_meetings')}
      </Typography>

      <SwitchContainer>
        <SwitchWithLabel
          label={t('tr_midweekMeetingScheduling')}
          readOnly={isProcessing}
          checked={isMidweek}
          onChange={handleToggleMidweek}
        />

        <SwitchWithLabel
          label={t('tr_weekendMeetingScheduling')}
          readOnly={isProcessing}
          checked={isWeekend}
          onChange={handleToggleWeekend}
        />

        <SwitchWithLabel
          label={t('tr_publicTalkScheduling')}
          readOnly={isProcessing}
          checked={isPublicTalk}
          onChange={handleTogglePublicTalk}
        />

        {dutiesEnabled && (
          <SwitchWithLabel
            label={t('tr_meetingDutiesScheduling')}
            readOnly={isProcessing}
            checked={isDuties}
            onChange={handleToggleDuties}
          />
        )}

        <SwitchWithLabel
          label={t('tr_attendanceRecordTracking')}
          readOnly={isProcessing}
          checked={isAttendance}
          onChange={handleToggleAttendance}
        />
      </SwitchContainer>
    </>
  );
};

export default UserAdditionalRights;
