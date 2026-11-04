import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { useAtomValue } from 'jotai';
import { useEffect, useRef } from 'react';
import { IconCloudSync, IconNoConnection } from '@icons/index';
import { useAppTranslation } from '@hooks/index';
import { workOfflineState } from '@states/app';
import { displaySnackNotification, setWorkOffline } from '@services/states/app';
import { getTranslation } from '@services/i18n/translation';
import Typography from '@components/typography';

// pauses started before this app launch are the ones to remind about
const appOpenedAt = Date.now();

const startWorkOffline = () => {
  setWorkOffline({ since: new Date().toISOString() });

  displaySnackNotification({
    header: getTranslation({ key: 'tr_offlineMode' }),
    message: getTranslation({ key: 'tr_workOfflineStarted' }),
    severity: 'warning',
    icon: <IconNoConnection color="var(--always-white)" />,
  });
};

const backOnline = () => setWorkOffline(undefined);

export const WorkOfflineMenuItem = ({
  sx,
  onDone,
}: {
  sx?: object;
  onDone?: VoidFunction;
}) => {
  const { t } = useAppTranslation();
  const workOffline = useAtomValue(workOfflineState);

  return (
    <MenuItem
      disableRipple
      sx={sx}
      onClick={() => {
        if (workOffline) backOnline();
        else startWorkOffline();
        onDone?.();
      }}
    >
      <ListItemIcon
        sx={{
          '&.MuiListItemIcon-root': {
            width: '24px',
            minWidth: '24px !important',
          },
        }}
      >
        {workOffline ? (
          <IconCloudSync color="var(--black)" />
        ) : (
          <IconNoConnection color="var(--black)" />
        )}
      </ListItemIcon>
      <ListItemText>
        <Typography className="body-regular">
          {t(workOffline ? 'tr_backOnlineMode' : 'tr_workOffline')}
        </Typography>
        <Typography className="label-small-regular" color="var(--grey-350)">
          {t(workOffline ? 'tr_continueSyncing' : 'tr_workOfflineDesc')}
        </Typography>
      </ListItemText>
    </MenuItem>
  );
};

export const WorkOfflineReminder = () => {
  const { t } = useAppTranslation();
  const workOffline = useAtomValue(workOfflineState);
  const reminded = useRef(false);

  useEffect(() => {
    if (reminded.current || !workOffline) return;
    if (new Date(workOffline.since).getTime() >= appOpenedAt) return;

    reminded.current = true;

    displaySnackNotification({
      header: t('tr_offlineMode'),
      message: t('tr_workOfflineReminder'),
      severity: 'warning',
      icon: <IconNoConnection color="var(--always-white)" />,
    });
  }, [workOffline, t]);

  return null;
};
