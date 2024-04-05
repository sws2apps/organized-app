import { ListItem } from '@mui/material';
import { DashboardCard, DashboardMenu, MinistryTimer } from '@features/index';
import { IconMinistryReport, IconStatsYear } from '@icons/index';
import { useAppTranslation } from '@hooks/index';

const MinistryCard = () => {
  const { t } = useAppTranslation();

  return (
    <DashboardCard header={t('tr_ministry')}>
      <ListItem disablePadding>
        <MinistryTimer duration="9:41" />
      </ListItem>
      <ListItem disablePadding>
        <DashboardMenu
          icon={<IconMinistryReport color="var(--black)" />}
          primaryText={t('tr_report')}
          badgeText="24:56"
        />
      </ListItem>
      <ListItem disablePadding>
        <DashboardMenu icon={<IconStatsYear color="var(--black)" />} primaryText={t('tr_serviceYear')} />
      </ListItem>
    </DashboardCard>
  );
};

export default MinistryCard;
