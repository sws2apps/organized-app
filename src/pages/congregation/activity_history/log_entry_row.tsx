import { TableCell, TableRow, Box, Tooltip } from '@mui/material';
import { useAtomValue } from 'jotai';
import { AppLogEntryType } from '@definition/app_logs';
import { useAppTranslation } from '@hooks/index';
import Typography from '@components/typography';
import Badge from '@components/badge';
import IconButton from '@components/icon_button';
import { IconCopy } from '@components/icons';
import { shortDateFormatState, hour24FormatState } from '@states/settings';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import {
  LOG_ACTION_LABEL_KEY,
  LOG_MODULE_BADGE_COLOR,
  LOG_MODULE_LABEL_KEY,
  buildLogChangeText,
  formatLogDate,
  formatLogTime,
} from '@services/app/app_logs';

type LogEntryRowProps = {
  entry: AppLogEntryType;
};

const CELL_PADDING = '8px 4px';

const LogEntryRow = ({ entry }: LogEntryRowProps) => {
  const { t } = useAppTranslation();

  const dateFormat = useAtomValue(shortDateFormatState);
  const is24h = useAtomValue(hour24FormatState);

  const badgeColor = LOG_MODULE_BADGE_COLOR[entry.module] ?? 'grey';
  const moduleLabel = t(LOG_MODULE_LABEL_KEY[entry.module] ?? entry.module);
  const actionLabel = t(LOG_ACTION_LABEL_KEY[entry.action] ?? entry.action);
  const changeText = buildLogChangeText(entry, t);
  const formattedDate = formatLogDate(entry.updatedAt, dateFormat);
  const formattedTime = formatLogTime(entry.updatedAt, is24h);

  const handleCopy = async () => {
    const text = [
      `${t('tr_name')}: ${entry.actor_name}`,
      `${t('tr_area')}: ${moduleLabel}`,
      `${t('tr_action')}: ${actionLabel}`,
      `${t('tr_change')}: ${changeText}`,
      `${t('tr_date')}: ${formattedDate}`,
      `${t('tr_time')}: ${formattedTime}`,
    ].join(', ');

    try {
      await navigator.clipboard.writeText(text);
      displaySnackNotification({
        header: t('tr_textCopied'),
        message: text,
        severity: 'success',
      });
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
          '& .copy-action': { opacity: 1 },
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

      {/* Action */}
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
          sx={{
            opacity: 0,
            transition: 'opacity 0.15s ease',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Tooltip title={t('tr_copy')} enterDelay={600} arrow>
            <IconButton
              onClick={handleCopy}
              aria-label={t('tr_copy')}
              sx={{ padding: '4px' }}
            >
              <IconCopy color="var(--black)" width={14} height={14} />
            </IconButton>
          </Tooltip>
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default LogEntryRow;
