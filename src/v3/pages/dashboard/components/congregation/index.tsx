import { ListItem } from '@mui/material';
import { DashboardCard, DashboardMenu } from '@features/index';
import { IconGroups, IconManageAccess, IconSettings, IconSynced } from '@icons';
import { useAppTranslation } from '@hooks/index';
import useCongregation from './useCongregation';

const CongregationCard = () => {
  const { t } = useAppTranslation();

  const { secondaryText, handleManualSync } = useCongregation();

  return (
    <DashboardCard header={t('trans_congregation')}>
      <ListItem disablePadding>
        <DashboardMenu icon={<IconGroups color="var(--black)" />} primaryText={t('trans_fieldServiceGroups')} />
      </ListItem>
      <ListItem disablePadding>
        <DashboardMenu icon={<IconManageAccess color="var(--black)" />} primaryText={t('trans_manageAccessToApps')} />
      </ListItem>
      <ListItem disablePadding>
        <DashboardMenu icon={<IconSettings color="var(--black)" />} primaryText={t('trans_congregationSettings')} />
      </ListItem>
      <ListItem disablePadding>
        <DashboardMenu
          icon={<IconSynced color="var(--black)" />}
          primaryText={t('trans_syncAppData')}
          secondaryText={secondaryText}
          onClick={handleManualSync}
        />
      </ListItem>
    </DashboardCard>
  );
};

export default CongregationCard;
