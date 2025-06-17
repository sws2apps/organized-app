import { ListItem } from '@mui/material';
import {
  IconGroups,
  IconManageAccess,
  IconSettings,
  IconSynced,
} from '@icons/index';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import useCongregation from './useCongregation';
import DashboardCard from '@features/dashboard/card';
import DashboardMenu from '@features/dashboard/menu';

const CongregationCard = () => {
  const { t } = useAppTranslation();

  const { isPublisher, isAdmin, isElder, isGroup, isLanguageGroupOverseer } =
    useCurrentUser();

  const {
    secondaryText,
    handleManualSync,
    isConnected,
    isUserAdmin,
    requests_count,
  } = useCongregation();

  return (
    <DashboardCard
      header={isGroup ? t('tr_languageGroupShort') : t('tr_congregation')}
    >
      {(isAdmin || isPublisher) && (
        <ListItem disablePadding>
          <DashboardMenu
            icon={<IconGroups color="var(--black)" />}
            primaryText={t('tr_fieldServiceGroups')}
            path="/field-service-groups"
          />
        </ListItem>
      )}

      {isConnected && isUserAdmin && (
        <ListItem disablePadding>
          <DashboardMenu
            icon={<IconManageAccess color="var(--black)" />}
            primaryText={t('tr_manageAccess')}
            badgeText={requests_count}
            path="/manage-access"
          />
        </ListItem>
      )}

      {!isGroup && (isAdmin || isElder) && (
        <ListItem disablePadding>
          <DashboardMenu
            path="/congregation-settings"
            icon={<IconSettings color="var(--black)" />}
            primaryText={t('tr_congregationSettings')}
          />
        </ListItem>
      )}

      {isGroup && isLanguageGroupOverseer && (
        <ListItem disablePadding>
          <DashboardMenu
            path="/group-settings"
            icon={<IconSettings color="var(--black)" />}
            primaryText={t('tr_groupSettings')}
          />
        </ListItem>
      )}

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
