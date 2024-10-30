import { ListItem } from '@mui/material';
import { DashboardCard, DashboardMenu } from '@features/index';
import {
  IconAssignment,
  IconCalendarWeek,
  IconDiamond,
  IconTalk,
} from '@icons/index';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { MeetingsCardProps } from './index.types';
import useMeetings from './useMeetings';

const MeetingsCard = ({ assignmentCount }: MeetingsCardProps) => {
  const { t } = useAppTranslation();

  const { isMidweekEditor, isWeekendEditor, isPublicTalkCoordinator } =
    useCurrentUser();

  const { handleOpenMyAssignments } = useMeetings();

  return (
    <DashboardCard header={t('tr_meetings')}>
      <ListItem disablePadding>
        <DashboardMenu
          icon={<IconAssignment color="var(--black)" />}
          primaryText={t('tr_viewMyAssignments')}
          badgeText={assignmentCount.toString()}
          onClick={handleOpenMyAssignments}
        />
      </ListItem>
      <ListItem disablePadding>
        <DashboardMenu
          icon={<IconCalendarWeek color="var(--black)" />}
          primaryText={t('tr_viewAssignmentsSchedule')}
          path="/weekly-schedules"
        />
      </ListItem>

      {isMidweekEditor && (
        <ListItem disablePadding>
          <DashboardMenu
            icon={<IconDiamond color="var(--black)" />}
            primaryText={t('tr_midweekMeeting')}
            path="/midweek-meeting"
          />
        </ListItem>
      )}

      {(isWeekendEditor || isPublicTalkCoordinator) && (
        <ListItem disablePadding>
          <DashboardMenu
            icon={<IconTalk color="var(--black)" />}
            primaryText={t('tr_weekendMeeting')}
            path="/weekend-meeting"
          />
        </ListItem>
      )}
    </DashboardCard>
  );
};

export default MeetingsCard;
