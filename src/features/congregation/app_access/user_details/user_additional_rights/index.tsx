import { useAppTranslation } from '@hooks/index';
import { SwitchContainer } from '../shared_styles';
import { UserMemberDetailsType } from '../index.types';
import useUserAdditionalRights from './useUserAdditionalRights';
import SwitchWithLabel from '@components/switch_with_label';
import Typography from '@components/typography';

const UserAdditionalRights = ({ user }: UserMemberDetailsType) => {
  const { t } = useAppTranslation();

  const {
    isMidweek,
    handleToggleMidweek,
    isPublicTalk,
    handleTogglePublicTalk,
    isAttendance,
    handleToggleAttendance,
  } = useUserAdditionalRights(user);

  return (
    <>
      <Typography className="h4" color="var(--grey-400)">
        {t('tr_additionalUserRights')}
      </Typography>

      <Typography className="body-small-semibold" color="var(--grey-400)">
        {t('tr_meetings')}
      </Typography>

      <SwitchContainer>
        <SwitchWithLabel
          label={t('tr_midweekMeetingScheduling')}
          checked={isMidweek}
          onChange={handleToggleMidweek}
        />

        <SwitchWithLabel
          label={t('tr_weekendMeetingScheduling')}
          checked={isPublicTalk}
          onChange={handleTogglePublicTalk}
        />

        <SwitchWithLabel
          label={t('tr_attendanceRecordTracking')}
          checked={isAttendance}
          onChange={handleToggleAttendance}
        />
      </SwitchContainer>
    </>
  );
};

export default UserAdditionalRights;
