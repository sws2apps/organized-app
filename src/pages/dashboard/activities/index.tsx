import { ListItem } from '@mui/material';
import { IconNextEvents, IconFootprint } from '@icons/index';
import { useAppTranslation } from '@hooks/index';
import DashboardCard from '@features/dashboard/card';
import DashboardMenu from '@features/dashboard/menu';

const ActivitiesCard = () => {
  const { t } = useAppTranslation();

  return (
    <DashboardCard header={t('tr_activitiesCard')}>
      <ListItem disablePadding>
        <DashboardMenu
          icon={<IconFootprint color="var(--black)" />}
          primaryText={t('tr_fieldServiceMeetings')}
          path="/activities/field-service-meetings"
        />
      </ListItem>
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
