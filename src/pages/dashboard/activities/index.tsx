import { ListItem } from '@mui/material';
import { IconNextEvents, IconFootprint } from '@icons/index';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import DashboardCard from '@features/dashboard/card';
import DashboardMenu from '@features/dashboard/menu';

const ActivitiesCard = () => {
  const { t } = useAppTranslation();
  const { isMidweekStudent } = useCurrentUser();

  return (
    <DashboardCard header={t('tr_activitiesCard')}>
      {!isMidweekStudent && (
        <ListItem disablePadding>
          <DashboardMenu
            icon={<IconFootprint color="var(--black)" />}
            primaryText={t('tr_fieldServiceMeetings')}
            path="/activities/field-service-meetings"
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
