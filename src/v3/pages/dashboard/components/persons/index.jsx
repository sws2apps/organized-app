import { ListItem } from '@mui/material';
import { DashboardCard, DashboardMenu } from '@features/index';
import { IconAddPerson, IconApplications, IconParticipants, IconVisitingSpeaker } from '@icons';
import { useAppTranslation } from '@hooks/index';

const PersonsCard = () => {
  const { t } = useAppTranslation();

  return (
    <DashboardCard header={t('persons')}>
      <ListItem disablePadding>
        <DashboardMenu icon={<IconParticipants color="var(--black)" />} primaryText={t('personsAll')} />
      </ListItem>
      <ListItem disablePadding>
        <DashboardMenu icon={<IconAddPerson color="var(--black)" />} primaryText={t('personAdd')} />
      </ListItem>
      <ListItem disablePadding>
        <DashboardMenu icon={<IconApplications color="var(--black)" />} primaryText={t('pioneerApplications')} />
      </ListItem>
      <ListItem disablePadding>
        <DashboardMenu icon={<IconVisitingSpeaker color="var(--black)" />} primaryText={t('visitingSpeakers')} />
      </ListItem>
    </DashboardCard>
  );
};

export default PersonsCard;
