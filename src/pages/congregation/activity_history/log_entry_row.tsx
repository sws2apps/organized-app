import { TableCell, TableRow, Box, Tooltip } from '@mui/material';
import { useAtomValue } from 'jotai';
import { format } from 'date-fns';
import {
  AppLogEntryType,
  AppLogModule,
  AppLogAction,
} from '@definition/app_logs';
import Typography from '@components/typography';
import Badge from '@components/badge';
import IconButton from '@components/icon_button';
import { BadgeColor } from '@definition/app';
import { IconCopy } from '@components/icons';
import { shortDateFormatState, hour24FormatState } from '@states/settings';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';

type LogEntryRowProps = {
  entry: AppLogEntryType;
};

const MODULE_BADGE_COLOR: Record<AppLogModule, BadgeColor> = {
  settings: 'accent',
  persons: 'green',
  schedules: 'orange',
  access: 'red',
  reports: 'grey',
  groups: 'grey',
  sync: 'accent',
};

const MODULE_LABEL: Record<AppLogModule, string> = {
  settings: 'Settings',
  persons: 'Persons',
  schedules: 'Schedules',
  access: 'Access',
  reports: 'Reports',
  groups: 'Groups',
  sync: 'Sync',
};

const ACTION_LABEL: Record<AppLogAction, string> = {
  create: 'Added',
  update: 'Edited',
  delete: 'Removed',
  publish: 'Published',
  accepted: 'Accepted',
  sync: 'Synced',
};

/**
 * Builds the "Change" column value from the entry.
 */
const buildChangeText = (entry: AppLogEntryType): string => {
  if (
    entry.action === 'update' &&
    entry.field_label &&
    entry.value_before !== undefined &&
    entry.value_after !== undefined
  ) {
    return `${entry.field_label}: ${entry.value_before} → ${entry.value_after}`;
  }

  if (
    entry.action === 'publish' &&
    entry.field_label &&
    entry.value_before !== undefined &&
    entry.value_after !== undefined
  ) {
    return `${entry.field_label}: ${entry.value_before} – ${entry.value_after}`;
  }

  if (entry.action === 'publish' && entry.value_after) {
    return entry.field_label
      ? `${entry.field_label}: ${entry.value_after}`
      : entry.value_after;
  }

  if (
    entry.action === 'create' ||
    entry.action === 'delete' ||
    entry.action === 'accepted'
  ) {
    const cleanDesc = entry.description
      .replace(
        /^(Added|Removed|Created|Granted|Accepted|Revoked)\s+\w+[\s:]+(?:for\s+|to\s+)?/i,
        ''
      )
      .replace(/^(join request from\s+)/i, '');
    return cleanDesc || entry.description;
  }

  return entry.field_label ?? entry.description;
};

/**
 * Builds a copyable plain-text summary of the log entry.
 */
const buildCopyText = (
  entry: AppLogEntryType,
  actionLabel: string,
  moduleLabel: string,
  changeText: string,
  formattedDate: string,
  formattedTime: string
): string => {
  return `Name: ${entry.actor_name}, Area: ${moduleLabel}, Action: ${actionLabel}, Change: ${changeText}, Date: ${formattedDate}, Time: ${formattedTime}`;
};

const CELL_PADDING = '8px 4px';

const LogEntryRow = ({ entry }: LogEntryRowProps) => {
  const dateFormat = useAtomValue(shortDateFormatState);
  const is24h = useAtomValue(hour24FormatState);

  const badgeColor = MODULE_BADGE_COLOR[entry.module] ?? 'grey';
  const moduleLabel = MODULE_LABEL[entry.module] ?? entry.module;
  const actionLabel = ACTION_LABEL[entry.action] ?? entry.action;
  const changeText = buildChangeText(entry);

  const date = new Date(entry.updatedAt);

  const formattedDate = (() => {
    try {
      return format(date, dateFormat);
    } catch {
      return entry.updatedAt.slice(0, 10);
    }
  })();

  const formattedTime = (() => {
    try {
      const timeFormat = is24h ? 'HH:mm:ss' : 'hh:mm:ss a';
      return format(date, timeFormat);
    } catch {
      return '';
    }
  })();

  const handleCopy = async () => {
    try {
      const text = buildCopyText(
        entry,
        actionLabel,
        moduleLabel,
        changeText,
        formattedDate,
        formattedTime
      );
      await navigator.clipboard.writeText(text);
    } catch {
      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: '',
        severity: 'error',
      });
    }
  };

  return (
    <TableRow
      sx={{
        verticalAlign: 'middle',
        '&:hover': {
          backgroundColor: 'var(--accent-150)',
          '& .copy-action': {
            opacity: 1,
          },
        },
      }}
    >
      {/* User */}
      <TableCell sx={{ padding: CELL_PADDING }}>
        <Typography className="body-small-semibold" color="var(--black)">
          {entry.actor_name}
        </Typography>
      </TableCell>

      {/* Area */}
      <TableCell sx={{ whiteSpace: 'nowrap', padding: CELL_PADDING }}>
        <Badge
          size="small"
          color={badgeColor}
          text={moduleLabel}
          centerContent
          sx={{
            width: '100%',
            maxWidth: '100%',
            overflow: 'hidden',
            '& .MuiTypography-root': {
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            },
          }}
        />
      </TableCell>

      {/* Action — centered */}
      <TableCell
        sx={{ whiteSpace: 'nowrap', width: '1px', padding: CELL_PADDING }}
        align="center"
      >
        <Typography className="body-small-regular" color="var(--grey-400)">
          {actionLabel}
        </Typography>
      </TableCell>

      {/* Change */}
      <TableCell sx={{ padding: CELL_PADDING }}>
        <Typography
          className="body-small-regular"
          color="var(--grey-400)"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'block',
          }}
        >
          {changeText}
        </Typography>
      </TableCell>

      {/* Date */}
      <TableCell
        sx={{ whiteSpace: 'nowrap', width: '1px', padding: CELL_PADDING }}
      >
        <Typography
          className="body-small-regular"
          color="var(--grey-400)"
          sx={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {formattedDate}
        </Typography>
      </TableCell>

      {/* Time — mono font */}
      <TableCell
        sx={{ whiteSpace: 'nowrap', width: '1px', padding: CELL_PADDING }}
      >
        <Typography
          className="body-small-regular"
          color="var(--grey-350)"
          sx={{
            fontFamily:
              '"SF Mono", "Menlo", "Consolas", "Liberation Mono", monospace',
            fontSize: '11px',
            letterSpacing: '0.02em',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {formattedTime}
        </Typography>
      </TableCell>

      {/* Copy — visible only on hover */}
      <TableCell
        sx={{
          width: '24px',
          padding: '2px',
          textAlign: 'center',
          verticalAlign: 'middle',
        }}
      >
        <Box
          className="copy-action"
          sx={{ opacity: 0, transition: 'opacity 0.15s ease', display: 'flex', justifyContent: 'center' }}
        >
          <Tooltip title="Copy" enterDelay={2000} arrow>
            <IconButton onClick={handleCopy} sx={{ padding: '4px' }}>
              <IconCopy
                color="var(--black)"
                width={14}
                height={14}
              />
            </IconButton>
          </Tooltip>
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default LogEntryRow;
