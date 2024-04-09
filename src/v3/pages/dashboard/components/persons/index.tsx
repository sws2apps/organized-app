import { ListItem } from '@mui/material';
import { DashboardCard, DashboardMenu } from '@features/index';
import { IconAddPerson, IconApplications, IconParticipants, IconVisitingSpeaker } from '@icons/index';
import { useAppTranslation } from '@hooks/index';

const PersonsCard = () => {
  const { t } = useAppTranslation();

  return (
    <DashboardCard header={t('tr_persons')}>
      <ListItem disablePadding>
        <DashboardMenu
          icon={<IconParticipants color="var(--black)" />}
          primaryText={t('tr_personsAll')}
          path="/persons"
        />
      </ListItem>
      <ListItem disablePadding>
        <DashboardMenu
          icon={<IconAddPerson color="var(--black)" />}
          primaryText={t('tr_personAdd')}
          path="/persons/new"
        />
      </ListItem>
      <ListItem disablePadding>
        <DashboardMenu
          icon={<IconApplications color="var(--black)" />}
          primaryText={t('tr_pioneerApplications')}
          badgeText="11"
        />
      </ListItem>
      <ListItem disablePadding>
        <DashboardMenu icon={<IconVisitingSpeaker color="var(--black)" />} primaryText={t('tr_visitingSpeakers')} />
      </ListItem>
    </DashboardCard>
  );
};

export default PersonsCard;
