import { ListItem } from '@mui/material';
import {
  IconHallSecurity,
  IconAssignment,
  IconCalendarWeek,
  IconDiamond,
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

  const {
    isMidweekEditor,
    isWeekendEditor,
    isPublicTalkCoordinator,
    canUseHallAttendant,
  } = useCurrentUser();

  const { showMeetingCard, showMidweek, showWeekend } = useSharedHook();

  const { handleOpenMyAssignments } = useMeetings();

  if (!showMeetingCard && !canUseHallAttendant) return null;

  return (
    <DashboardCard header={t('tr_meetings')}>
      <ListItem disablePadding>
        <DashboardMenu
          icon={<IconAssignment color="var(--black)" />}
          primaryText={t('tr_viewMyAssignments')}
          badgeText={assignmentCount ? assignmentCount.toString() : ''}
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
      {canUseHallAttendant && (
        <ListItem disablePadding>
          <DashboardMenu
            icon={<IconHallSecurity color="var(--black)" />}
            primaryText={t('tr_hallAttendantMode')}
            path="/hall-attendant"
          />
        </ListItem>
      )}
    </DashboardCard>
  );
};

export default MeetingsCard;
