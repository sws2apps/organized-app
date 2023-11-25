import { ListItem } from '@mui/material';
import { DashboardCard, DashboardMenu, MinistryTimer } from '@features/index';
import { IconMinistryReport, IconStatsYear } from '@icons';
import { useAppTranslation } from '@hooks/index';

const MinistryCard = () => {
  const { t } = useAppTranslation();

  return (
    <DashboardCard header={t('ministry')}>
      <ListItem disablePadding>
        <MinistryTimer />
      </ListItem>
      <ListItem disablePadding>
        <DashboardMenu icon={<IconMinistryReport color="var(--black)" />} primaryText={t('report')} badgeText="24:56" />
      </ListItem>
      <ListItem disablePadding>
        <DashboardMenu icon={<IconStatsYear color="var(--black)" />} primaryText={t('serviceYear')} />
      </ListItem>
    </DashboardCard>
  );
};

export default MinistryCard;
