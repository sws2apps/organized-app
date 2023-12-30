import { ListItem } from '@mui/material';
import { DashboardCard, DashboardMenu } from '@features/index';
import { IconAddPerson, IconApplications, IconParticipants, IconVisitingSpeaker } from '@icons';
import { useAppTranslation } from '@hooks/index';

const PersonsCard = () => {
  const { t } = useAppTranslation();

  return (
    <DashboardCard header={t('trans_persons')}>
      <ListItem disablePadding>
        <DashboardMenu icon={<IconParticipants color="var(--black)" />} primaryText={t('trans_personsAll')} />
      </ListItem>
      <ListItem disablePadding>
        <DashboardMenu icon={<IconAddPerson color="var(--black)" />} primaryText={t('trans_personAdd')} />
      </ListItem>
      <ListItem disablePadding>
        <DashboardMenu
          icon={<IconApplications color="var(--black)" />}
          primaryText={t('trans_pioneerApplications')}
          badgeText="11"
        />
      </ListItem>
      <ListItem disablePadding>
        <DashboardMenu icon={<IconVisitingSpeaker color="var(--black)" />} primaryText={t('trans_visitingSpeakers')} />
      </ListItem>
    </DashboardCard>
  );
};

export default PersonsCard;
