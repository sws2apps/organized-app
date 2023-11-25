import { ListItem } from '@mui/material';
import { DashboardCard, DashboardMenu } from '@features/index';
import { IconGroups, IconManageAccess, IconSettings, IconSync } from '@icons';
import { useAppTranslation } from '@hooks/index';

const CongregationCard = () => {
  const { t } = useAppTranslation();

  return (
    <DashboardCard header={t('congregation')}>
      <ListItem disablePadding>
        <DashboardMenu icon={<IconGroups color="var(--black)" />} primaryText={t('fieldServiceGroups')} />
      </ListItem>
      <ListItem disablePadding>
        <DashboardMenu icon={<IconManageAccess color="var(--black)" />} primaryText={t('manageAccessToApps')} />
      </ListItem>
      <ListItem disablePadding>
        <DashboardMenu icon={<IconSettings color="var(--black)" />} primaryText={t('congregationSettings')} />
      </ListItem>
      <ListItem disablePadding>
        <DashboardMenu icon={<IconSync color="var(--black)" />} primaryText={t('syncAppData')} />
      </ListItem>
    </DashboardCard>
  );
};

export default CongregationCard;
