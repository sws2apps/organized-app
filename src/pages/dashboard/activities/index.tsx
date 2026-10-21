import { ListItem } from '@mui/material';
import { IconClean, IconNextEvents } from '@icons/index';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import DashboardCard from '@features/dashboard/card';
import DashboardMenu from '@features/dashboard/menu';
import useSharedHook from '../useSharedHook';

const ActivitiesCard = () => {
  const { t } = useAppTranslation();

  const { isCleaningEditor } = useCurrentUser();

  const { showMidweek, showWeekend } = useSharedHook();

  return (
    <DashboardCard header={t('tr_activitiesCard')}>
      {isCleaningEditor && (showMidweek || showWeekend) && (
        <ListItem disablePadding>
          <DashboardMenu
            icon={<IconClean color="var(--black)" />}
            primaryText={t('tr_hallCleaning')}
            path="/activities/hall-cleaning"
          />
        </ListItem>
      )}

      <ListItem disablePadding>
        <DashboardMenu
          icon={<IconNextEvents color="var(--black)" />}
          primaryText={t('tr_upcomingEvents')}
          path="/activities/upcoming-events"
        />
      </ListItem>
    </DashboardCard>
  );
};

export default ActivitiesCard;
