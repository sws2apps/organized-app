import { ListItem } from '@mui/material';
import { DashboardCard, DashboardMenu } from '@features/index';
import {
  IconAddPerson,
  IconApplications,
  IconParticipants,
  IconVisitingSpeaker,
} from '@icons/index';
import { useAppTranslation } from '@hooks/index';
import usePersons from './usePersons';

const PersonsCard = () => {
  const { t } = useAppTranslation();

  const { handleAddNewPerson, show_AP, AP_count } = usePersons();

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
          onClick={handleAddNewPerson}
        />
      </ListItem>

      {show_AP && (
        <ListItem disablePadding>
          <DashboardMenu
            icon={<IconApplications color="var(--black)" />}
            primaryText={t('tr_pioneerApplications')}
            badgeText={AP_count}
            path="/pioneer-applications"
          />
        </ListItem>
      )}

      <ListItem disablePadding>
        <DashboardMenu
          icon={<IconVisitingSpeaker color="var(--black)" />}
          primaryText={t('tr_speakersCatalog')}
          path="/speakers-catalog"
        />
      </ListItem>
    </DashboardCard>
  );
};

export default PersonsCard;
