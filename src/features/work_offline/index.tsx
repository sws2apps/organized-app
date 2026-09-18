import { Box, ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { useAtomValue } from 'jotai';
import { IconCloudSync, IconPause } from '@icons/index';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { workOfflineState } from '@states/app';
import { setWorkOffline } from '@services/states/app';
import usePendingSync from '@hooks/usePendingSync';
import { useEffect, useRef } from 'react';
import { displaySnackNotification } from '@services/states/app';
import { getTranslation } from '@services/i18n/translation';
import Typography from '@components/typography';

// pauses started before this app launch are the ones to remind about
const appOpenedAt = Date.now();

const startWorkOffline = () => {
  setWorkOffline({ since: new Date().toISOString() });

  // others will not see this device's changes until it resumes: say so once
  displaySnackNotification({
    header: getTranslation({ key: 'tr_workingOffline' }),
    message: getTranslation({ key: 'tr_workOfflineStarted' }),
    icon: <IconPause color="var(--always-white)" />,
  });
};

const resumeWork = () => setWorkOffline(undefined);

/**
 * Menu entry: pause every server connection and sync without signing out.
 */
export const WorkOfflineMenuItem = ({
  sx,
  onDone,
}: {
  sx?: object;
  onDone?: VoidFunction;
}) => {
  const { t } = useAppTranslation();
  const workOffline = useAtomValue(workOfflineState);

  const iconBox = {
    '&.MuiListItemIcon-root': { width: '24px', minWidth: '24px !important' },
  };

  return (
    <MenuItem
      disableRipple
      sx={sx}
      onClick={() => {
        if (workOffline) resumeWork();
        else startWorkOffline();
        onDone?.();
      }}
    >
      <ListItemIcon sx={iconBox}>
        {workOffline ? (
          <IconCloudSync color="var(--black)" />
        ) : (
          <IconPause color="var(--black)" />
        )}
      </ListItemIcon>
      <ListItemText>
        <Typography className="body-regular">
          {t(workOffline ? 'tr_resumeSyncing' : 'tr_workOffline')}
        </Typography>
        <Typography className="label-small-regular" color="var(--grey-350)">
          {t(workOffline ? 'tr_workingOffline' : 'tr_workOfflineDesc')}
        </Typography>
      </ListItemText>
    </MenuItem>
  );
};

/**
 * Always visible while working offline, so it cannot be forgotten; one tap
 * resumes syncing.
 */
export const WorkOfflineChip = () => {
  const { t } = useAppTranslation();
  const { tabletUp } = useBreakpoints();
  const workOffline = useAtomValue(workOfflineState);
  const { pendingCount } = usePendingSync();

  // a pause is easy to forget: remind on every open
  const reminded = useRef(false);

  useEffect(() => {
    if (reminded.current || !workOffline) return;
    if (new Date(workOffline.since).getTime() >= appOpenedAt) return;

    reminded.current = true;

    displaySnackNotification({
      header: t('tr_workingOffline'),
      message: t('tr_workOfflineReminder'),
      icon: <IconPause color="var(--always-white)" />,
    });
  }, [workOffline, t]);

  if (!workOffline) return null;

  return (
    <Box
      role="button"
      tabIndex={0}
      aria-label={`${t('tr_workingOffline')}. ${t('tr_resumeSync')}`}
      onClick={() => resumeWork()}
      onKeyDown={(e) =>
        e.key === 'Enter' || e.key === ' ' ? resumeWork() : null
      }
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 10px 4px 8px',
        borderRadius: 'var(--radius-max)',
        border: '1px dashed var(--grey-400)',
        backgroundColor: 'var(--grey-150)',
        cursor: 'pointer',
        '&:focus-visible': { outline: 'var(--accent-main) auto 1px' },
      }}
    >
      <IconPause color="var(--grey-400)" width={16} height={16} />
      <Typography className="label-small-medium" color="var(--grey-400)">
        {tabletUp ? t('tr_workingOffline') : t('tr_offlineShort')}
        {pendingCount > 0 ? ` · ${pendingCount}` : ''}
      </Typography>
      <IconCloudSync color="var(--accent-main)" width={16} height={16} />
      {tabletUp && (
        <Typography className="label-small-medium" color="var(--accent-main)">
          {t('tr_resumeSync')}
        </Typography>
      )}
    </Box>
  );
};
