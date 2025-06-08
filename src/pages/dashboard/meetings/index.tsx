import { ListItem } from '@mui/material';
import {
  IconAssignment,
  IconCalendarWeek,
  IconDiamond,
  IconDuties,
  IconTalk,
} from '@icons/index';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { MeetingsCardProps } from './index.types';
import useMeetings from './useMeetings';
import useSharedHook from '../useSharedHook';
import DashboardCard from '@features/dashboard/card';
import DashboardMenu from '@features/dashboard/menu';

const MeetingsCard = ({ assignmentCount }: MeetingsCardProps) => {
  const { t } = useAppTranslation();

  const { isMidweekEditor, isWeekendEditor, isPublicTalkCoordinator } =
    useCurrentUser();

  const { showMeetingCard, showMidweek, showWeekend } = useSharedHook();

  const { handleOpenMyAssignments } = useMeetings();

  if (!showMeetingCard) return null;

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

      <ListItem disablePadding>
        <DashboardMenu
          icon={<IconDuties color="var(--black)" />}
          primaryText={t('tr_meetingDutiesSchedules')}
          path="/meeting-duties"
        />
      </ListItem>

      {showMidweek && isMidweekEditor && (
        <ListItem disablePadding>
          <DashboardMenu
            icon={<IconDiamond color="var(--black)" />}
            primaryText={t('tr_midweekMeeting')}
            path="/midweek-meeting"
          />
        </ListItem>
      )}

      {showWeekend && (isWeekendEditor || isPublicTalkCoordinator) && (
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
