import { ListItem } from '@mui/material';
import { useAtomValue } from 'jotai';
import { IconCollaborativeActivities, IconNextEvents } from '@icons/index';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { congAccountConnectedState } from '@states/app';
import { volunteerActivitiesOpenCountState } from '@states/volunteer_activities';
import DashboardCard from '@features/dashboard/card';
import DashboardMenu from '@features/dashboard/menu';

const ActivitiesCard = () => {
  const { t } = useAppTranslation();

  const { isAdmin, isPublisher } = useCurrentUser();

  const isConnected = useAtomValue(congAccountConnectedState);
  const openActivitiesCount = useAtomValue(volunteerActivitiesOpenCountState);

  return (
    <DashboardCard header={t('tr_activitiesCard')}>
      <ListItem disablePadding>
        <DashboardMenu
          icon={<IconNextEvents color="var(--black)" />}
          primaryText={t('tr_upcomingEvents')}
          path="/activities/upcoming-events"
        />
      </ListItem>

      {(isPublisher || isAdmin) && isConnected && (
        <ListItem disablePadding>
          <DashboardMenu
            icon={<IconCollaborativeActivities color="var(--black)" />}
            primaryText={t('tr_volunteerActivities')}
            badgeText={
              openActivitiesCount ? openActivitiesCount.toString() : ''
            }
            path="/activities/volunteer-activities"
          />
        </ListItem>
      )}
    </DashboardCard>
  );
};

export default ActivitiesCard;
