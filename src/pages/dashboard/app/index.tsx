import { useOutletContext } from 'react-router';
import { ListItem } from '@mui/material';
import {
  IconManageAccess,
  IconRestart,
  IconSettings,
  IconSynced,
} from '@icons/index';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import useApp from './useApp';
import DashboardCard from '@features/dashboard/card';
import DashboardMenu from '@features/dashboard/menu';

const AppCard = () => {
  const { t } = useAppTranslation();

  const { updatePwa } = useOutletContext<{ updatePwa: VoidFunction }>();

  const { isAdmin, isElder, isGroup, isLanguageGroupOverseer } =
    useCurrentUser();

  const {
    secondaryText,
    handleManualSync,
    handleForceReload,
    isConnected,
    isUserAdmin,
    requests_count,
    showForceReload,
  } = useApp({ updatePwa });

  const showCongregationSettings = !isGroup && (isAdmin || isElder);
  const showGroupSettings = isGroup && isLanguageGroupOverseer;

  const hasEntries =
    isConnected ||
    showCongregationSettings ||
    showGroupSettings ||
    showForceReload;

  if (!hasEntries) return null;

  return (
    <DashboardCard header={t('tr_app')}>
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

      {showCongregationSettings && (
        <ListItem disablePadding>
          <DashboardMenu
            path="/congregation-settings"
            icon={<IconSettings color="var(--black)" />}
            primaryText={t('tr_congregationSettings')}
          />
        </ListItem>
      )}

      {showGroupSettings && (
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

      {showForceReload && (
        <ListItem disablePadding>
          <DashboardMenu
            icon={<IconRestart color="var(--black)" />}
            primaryText={t('tr_forceReloadApp')}
            secondaryText={t('tr_forceReloadAppDesc')}
            onClick={handleForceReload}
          />
        </ListItem>
      )}
    </DashboardCard>
  );
};

export default AppCard;
