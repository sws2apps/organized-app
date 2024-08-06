import { ListItem } from '@mui/material';
import { DashboardCard, DashboardMenu, MinistryTimer } from '@features/index';
import {
  IconMinistryReport,
  IconPioneerForm,
  IconStatsYear,
} from '@icons/index';
import { useAppTranslation } from '@hooks/index';

const MinistryCard = () => {
  const { t } = useAppTranslation();

  return (
    <DashboardCard header={t('tr_ministry')}>
      <ListItem disablePadding>
        <MinistryTimer duration="00:00" />
      </ListItem>
      <ListItem disablePadding>
        <DashboardMenu
          icon={<IconMinistryReport color="var(--black)" />}
          primaryText={t('tr_report')}
          badgeText="24:56"
          path="/ministry-report"
        />
      </ListItem>
      <ListItem disablePadding>
        <DashboardMenu
          icon={<IconStatsYear color="var(--black)" />}
          primaryText={t('tr_serviceYear')}
          path="/service-year"
        />
      </ListItem>
      <ListItem disablePadding>
        <DashboardMenu
          icon={<IconPioneerForm color="var(--black)" />}
          primaryText={t('tr_applicationAuxiliaryPioneer')}
          path="/auxiliary-pioneer-application"
        />
      </ListItem>
    </DashboardCard>
  );
};

export default MinistryCard;
