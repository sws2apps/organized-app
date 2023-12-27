import { ListItem } from '@mui/material';
import { DashboardCard, DashboardMenu } from '@features/index';
import { IconAssignment, IconCalendarWeek, IconDiamond, IconRefreshSchedule, IconTalk } from '@icons';
import { useAppTranslation } from '@hooks/index';

const MeetingsCard = () => {
  const { t } = useAppTranslation();

  return (
    <DashboardCard header={t('trans_meetings')}>
      <ListItem disablePadding>
        <DashboardMenu
          icon={<IconAssignment color="var(--black)" />}
          primaryText={t('trans_viewMyAssignments')}
          badgeText="3"
        />
      </ListItem>
      <ListItem disablePadding>
        <DashboardMenu
          icon={<IconCalendarWeek color="var(--black)" />}
          primaryText={t('trans_viewAssignmentsSchedule')}
        />
      </ListItem>
      <ListItem disablePadding>
        <DashboardMenu icon={<IconDiamond color="var(--black)" />} primaryText={t('trans_midweekMeeting')} />
      </ListItem>
      <ListItem disablePadding>
        <DashboardMenu icon={<IconTalk color="var(--black)" />} primaryText={t('trans_weekendMeeting')} />
      </ListItem>
      <ListItem disablePadding>
        <DashboardMenu icon={<IconRefreshSchedule color="var(--black)" />} primaryText={t('trans_refreshSchedule')} />
      </ListItem>
    </DashboardCard>
  );
};

export default MeetingsCard;
