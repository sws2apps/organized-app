import { ListItem } from '@mui/material';
import {
  IconMinistryReport,
  IconPioneerForm,
  IconStatsYear,
} from '@icons/index';
import { useAppTranslation } from '@hooks/index';
import useMinistry from './useMinistry';
import DashboardCard from '@features/dashboard/card';
import DashboardMenu from '@features/dashboard/menu';
import MinistryTimer from '@features/ministry/report/ministry_timer';

const MinistryCard = () => {
  const { t } = useAppTranslation();

  const { isPioneer, enable_AP_application, hours_total } = useMinistry();

  return (
    <DashboardCard header={t('tr_ministry')}>
      {isPioneer && (
        <ListItem disablePadding>
          <MinistryTimer />
        </ListItem>
      )}

      <ListItem disablePadding>
        <DashboardMenu
          icon={<IconMinistryReport color="var(--black)" />}
          primaryText={t('tr_report')}
          badgeText={isPioneer && hours_total}
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

      {enable_AP_application && (
        <ListItem disablePadding>
          <DashboardMenu
            icon={<IconPioneerForm color="var(--black)" />}
            primaryText={t('tr_applicationAuxiliaryPioneer')}
            path="/auxiliary-pioneer-application"
          />
        </ListItem>
      )}
    </DashboardCard>
  );
};

export default MinistryCard;
