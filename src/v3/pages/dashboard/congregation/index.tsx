import { ListItem } from '@mui/material';
import { DashboardCard, DashboardMenu } from '@features/index';
import { IconGroups, IconManageAccess, IconSettings, IconSynced } from '@icons/index';
import { useAppTranslation } from '@hooks/index';
import useCongregation from './useCongregation';

const CongregationCard = () => {
  const { t } = useAppTranslation();

  const { secondaryText, handleManualSync, isConnected } = useCongregation();

  return (
    <DashboardCard header={t('tr_congregation')}>
      <ListItem disablePadding>
        <DashboardMenu icon={<IconGroups color="var(--black)" />} primaryText={t('tr_fieldServiceGroups')} />
      </ListItem>
      {isConnected && (
        <ListItem disablePadding>
          <DashboardMenu icon={<IconManageAccess color="var(--black)" />} primaryText={t('tr_manageAccess')} />
        </ListItem>
      )}

      <ListItem disablePadding>
        <DashboardMenu icon={<IconSettings color="var(--black)" />} primaryText={t('tr_congregationSettings')} />
      </ListItem>
      {isConnected && (
        <ListItem disablePadding>
          <DashboardMenu
            icon={<IconSynced color="var(--black)" />}
            primaryText={t('tr_syncAppData')}
            secondaryText={secondaryText}
            onClick={handleManualSync}
          />
        </ListItem>
      )}
    </DashboardCard>
  );
};

export default CongregationCard;
