import { ListItem } from '@mui/material';
import { DashboardCard, DashboardMenu } from '@features/index';
import {
  IconGroups,
  IconManageAccess,
  IconPublisherRecordCard,
  IconSettings,
  IconSynced,
} from '@icons/index';
import { useAppTranslation } from '@hooks/index';
import useCongregation from './useCongregation';

const CongregationCard = () => {
  const { t } = useAppTranslation();

  const { secondaryText, handleManualSync, isConnected } = useCongregation();

  return (
    <DashboardCard header={t('tr_congregation')}>
      <ListItem disablePadding>
        <DashboardMenu
          icon={<IconGroups color="var(--black)" />}
          primaryText={t('tr_fieldServiceGroups')}
          path="/service-groups"
        />
      </ListItem>
      {isConnected && (
        <ListItem disablePadding>
          <DashboardMenu
            icon={<IconPublisherRecordCard color="var(--black)" />}
            primaryText={t('tr_publishersRecords')}
            path="/publisher-records"
          />
        </ListItem>
      )}
      {isConnected && (
        <ListItem disablePadding>
          <DashboardMenu
            icon={<IconManageAccess color="var(--black)" />}
            primaryText={t('tr_manageAccess')}
            path="/manage-access"
          />
        </ListItem>
      )}

      <ListItem disablePadding>
        <DashboardMenu
          path="/congregation-settings"
          icon={<IconSettings color="var(--black)" />}
          primaryText={t('tr_congregationSettings')}
        />
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
