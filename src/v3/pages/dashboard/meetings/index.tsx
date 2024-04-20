import { ListItem } from '@mui/material';
import { DashboardCard, DashboardMenu } from '@features/index';
import { IconAssignment, IconCalendarWeek, IconDiamond, IconRefreshSchedule, IconTalk } from '@icons/index';
import { useAppTranslation } from '@hooks/index';
import useMeetings from './useMeetings';

const MeetingsCard = () => {
  const { t } = useAppTranslation();

  const { handleOpenMyAssignments, isConnected } = useMeetings();

  return (
    <DashboardCard header={t('tr_meetings')}>
      <ListItem disablePadding>
        <DashboardMenu
          icon={<IconAssignment color="var(--black)" />}
          primaryText={t('tr_viewMyAssignments')}
          badgeText="3"
          onClick={handleOpenMyAssignments}
        />
      </ListItem>
      <ListItem disablePadding>
        <DashboardMenu icon={<IconCalendarWeek color="var(--black)" />} primaryText={t('tr_viewAssignmentsSchedule')} />
      </ListItem>
      <ListItem disablePadding>
        <DashboardMenu icon={<IconDiamond color="var(--black)" />} primaryText={t('tr_midweekMeeting')} />
      </ListItem>
      <ListItem disablePadding>
        <DashboardMenu icon={<IconTalk color="var(--black)" />} primaryText={t('tr_weekendMeeting')} />
      </ListItem>
      {isConnected && (
        <ListItem disablePadding>
          <DashboardMenu icon={<IconRefreshSchedule color="var(--black)" />} primaryText={t('tr_refreshSchedule')} />
        </ListItem>
      )}
    </DashboardCard>
  );
};

export default MeetingsCard;
