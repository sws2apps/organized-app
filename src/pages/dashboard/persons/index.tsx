import { ListItem } from '@mui/material';
import {
  IconAddPerson,
  IconApplications,
  IconParticipants,
  IconVisitingSpeaker,
} from '@icons/index';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import usePersons from './usePersons';
import useSharedHook from '../useSharedHook';
import DashboardCard from '@features/dashboard/card';
import DashboardMenu from '@features/dashboard/menu';

const PersonsCard = () => {
  const { t } = useAppTranslation();

  const { handleAddNewPerson, show_AP, AP_count } = usePersons();

  const { isPersonEditor } = useCurrentUser();

  const { showWeekend } = useSharedHook();

  return (
    <DashboardCard header={t('tr_persons')}>
      <ListItem disablePadding>
        <DashboardMenu
          icon={<IconParticipants color="var(--black)" />}
          primaryText={t('tr_personsAll')}
          path="/persons"
        />
      </ListItem>

      {isPersonEditor && (
        <ListItem disablePadding>
          <DashboardMenu
            icon={<IconAddPerson color="var(--black)" />}
            primaryText={t('tr_personAdd')}
            onClick={handleAddNewPerson}
          />
        </ListItem>
      )}

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

      {showWeekend && (
        <ListItem disablePadding>
          <DashboardMenu
            icon={<IconVisitingSpeaker color="var(--black)" />}
            primaryText={t('tr_speakersCatalog')}
            path="/speakers-catalog"
          />
        </ListItem>
      )}
    </DashboardCard>
  );
};

export default PersonsCard;
