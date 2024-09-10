import { ListItem } from '@mui/material';
import { DashboardCard, DashboardMenu } from '@features/index';
import {
  IconGroups,
  IconManageAccess,
  IconSettings,
  IconSynced,
} from '@icons/index';
import { useAppTranslation } from '@hooks/index';
import useCongregation from './useCongregation';

const CongregationCard = () => {
  const { t } = useAppTranslation();

  const { secondaryText, handleManualSync, isConnected, isUserAdmin } =
    useCongregation();

  return (
    <DashboardCard header={t('tr_congregation')}>
      <ListItem disablePadding>
        <DashboardMenu
          icon={<IconGroups color="var(--black)" />}
          primaryText={t('tr_fieldServiceGroups')}
          path="/field-service-groups"
        />
      </ListItem>

      {isConnected && isUserAdmin && (
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
            icon={
              <IconSynced
                color="var(--black)"
                className="organized-sync-icon"
              />
            }
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
