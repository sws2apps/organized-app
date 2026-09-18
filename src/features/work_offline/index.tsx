import { Box, ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { useAtomValue } from 'jotai';
import { IconCloudSync, IconPause } from '@icons/index';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { workOfflineState } from '@states/app';
import { setWorkOffline } from '@services/states/app';
import usePendingSync from '@hooks/usePendingSync';
import { useEffect, useRef, useState } from 'react';
import { displaySnackNotification } from '@services/states/app';
import { getTranslation } from '@services/i18n/translation';
import Typography from '@components/typography';
import { hour24FormatState } from '@states/settings';
import { formatDate } from '@utils/date';

type PauseChoice = 'hour' | 'tomorrow' | 'manual';

// pauses started before this app launch are the ones to remind about
const appOpenedAt = Date.now();

const pauseUntil = (choice: PauseChoice): string | undefined => {
  if (choice === 'hour') return new Date(Date.now() + 3600000).toISOString();

  if (choice === 'tomorrow') {
    const next = new Date();
    next.setDate(next.getDate() + 1);
    next.setHours(6, 0, 0, 0);
    return next.toISOString();
  }

  return undefined;
};

const startWorkOffline = (choice: PauseChoice) => {
  setWorkOffline({
    since: new Date().toISOString(),
    until: pauseUntil(choice),
  });

  // others will not see this device's changes until it resumes: say so once
  displaySnackNotification({
    header: getTranslation({ key: 'tr_workingOffline' }),
    message: getTranslation({ key: 'tr_workOfflineStarted' }),
    icon: <IconPause color="var(--always-white)" />,
  });
};

const resumeWork = () => setWorkOffline(undefined);

const toggleWorkOffline = (on: boolean) => {
  if (on) startWorkOffline('hour');
  else resumeWork();
};

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
  const [choosing, setChoosing] = useState(false);
  const hour24 = useAtomValue(hour24FormatState);

  const iconBox = {
    '&.MuiListItemIcon-root': { width: '24px', minWidth: '24px !important' },
  };

  if (choosing && !workOffline) {
    const choices: [PauseChoice, string][] = [
      ['hour', t('tr_pauseOneHour')],
      ['tomorrow', t('tr_pauseUntilTomorrow')],
      ['manual', t('tr_pauseUntilResume')],
    ];

    return (
      <>
        {choices.map(([choice, label]) => (
          <MenuItem
            key={choice}
            disableRipple
            sx={sx}
            onClick={() => {
              startWorkOffline(choice);
              setChoosing(false);
              onDone?.();
            }}
          >
            <ListItemIcon sx={iconBox}>
              <IconPause color="var(--grey-400)" />
            </ListItemIcon>
            <ListItemText>
              <Typography className="body-regular">{label}</Typography>
            </ListItemText>
          </MenuItem>
        ))}
      </>
    );
  }

  if (workOffline) {
    const until = workOffline.until
      ? formatDate(new Date(workOffline.until), hour24 ? 'HH:mm' : 'h:mm a')
      : undefined;

    return (
      <MenuItem
        disableRipple
        sx={sx}
        onClick={() => {
          resumeWork();
          onDone?.();
        }}
      >
        <ListItemIcon sx={iconBox}>
          <IconCloudSync color="var(--black)" />
        </ListItemIcon>
        <ListItemText>
          <Typography className="body-regular">
            {t('tr_resumeSyncing')}
          </Typography>
          <Typography className="label-small-regular" color="var(--grey-350)">
            {until
              ? t('tr_workingOfflineUntil', { time: until })
              : t('tr_workingOffline')}
          </Typography>
        </ListItemText>
      </MenuItem>
    );
  }

  return (
    <MenuItem disableRipple sx={sx} onClick={() => setChoosing(true)}>
      <ListItemIcon sx={iconBox}>
        <IconPause color="var(--black)" />
      </ListItemIcon>
      <ListItemText>
        <Typography className="body-regular">{t('tr_workOffline')}</Typography>
        <Typography className="label-small-regular" color="var(--grey-350)">
          {t('tr_workOfflineDesc')}
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

  // a pause with no end time is the one people forget: remind on every open
  const reminded = useRef(false);

  useEffect(() => {
    if (reminded.current || !workOffline || workOffline.until) return;
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
      onClick={() => toggleWorkOffline(false)}
      onKeyDown={(e) =>
        e.key === 'Enter' || e.key === ' ' ? toggleWorkOffline(false) : null
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
