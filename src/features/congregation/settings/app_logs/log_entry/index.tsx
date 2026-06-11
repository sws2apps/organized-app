import { Box } from '@mui/material';
import { useAtomValue } from 'jotai';
import { format } from 'date-fns';
import { AppLogEntryType, AppLogModule, AppLogAction } from '@definition/app_logs';
import Typography from '@components/typography';
import { shortDateFormatState, hour24FormatState } from '@states/settings';

type LogEntryProps = {
  entry: AppLogEntryType;
};

const MODULE_COLOR: Record<AppLogModule, string> = {
  settings: 'var(--accent-dark)',
  persons: 'var(--green-main)',
  schedules: 'var(--orange-dark)',
  access: 'var(--red-main)',
  reports: 'var(--accent-400)',
  groups: 'var(--accent-400)',
  sync: 'var(--accent-dark)',
};

const MODULE_BG: Record<AppLogModule, string> = {
  settings: 'var(--accent-200)',
  persons: 'var(--green-secondary-light, #e6f4ea)',
  schedules: 'var(--orange-secondary-light, #fff3e0)',
  access: 'var(--red-secondary-light, #fce4ec)',
  reports: 'var(--accent-150)',
  groups: 'var(--accent-150)',
  sync: 'var(--accent-200)',
};

const ACTION_LABEL: Record<AppLogAction, string> = {
  create: 'Added',
  update: 'Updated',
  delete: 'Removed',
  publish: 'Published',
  accepted: 'Accepted',
  sync: 'Synced',
};

const LogEntry = ({ entry }: LogEntryProps) => {
  const {
    actor_name,
    module,
    action,
    description,
    updatedAt,
    field_label,
    value_before,
    value_after,
  } = entry;

  const dateFormat = useAtomValue(shortDateFormatState);
  const is24h = useAtomValue(hour24FormatState);

  const color = MODULE_COLOR[module] ?? 'var(--accent-dark)';
  const bg = MODULE_BG[module] ?? 'var(--accent-200)';
  const actionLabel = ACTION_LABEL[action] ?? action;

  const formattedTime = (() => {
    try {
      const date = new Date(updatedAt);
      const timeFormat = is24h ? 'HH:mm:ss' : 'hh:mm:ss a';
      return `${format(date, dateFormat)} · ${format(date, timeFormat)}`;
    } catch {
      return updatedAt;
    }
  })();

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: '8px 16px',
        padding: '10px 4px',
        borderRadius: 'var(--radius-s)',
        transition: 'background 0.15s ease',
        '&:hover': { backgroundColor: 'var(--accent-100)' },
      }}
    >
      {/* Left: name + action badge + description */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}>
        {/* Row 1: actor name + module badge + action label */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <Typography
            className="body-small-semibold"
            sx={{ color: 'var(--black)', whiteSpace: 'nowrap' }}
          >
            {actor_name}
          </Typography>

          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '1px 8px',
              borderRadius: 'var(--radius-s)',
              backgroundColor: bg,
              border: `1px solid ${color}`,
              flexShrink: 0,
            }}
          >
            <Typography
              className="label-small-regular"
              sx={{
                color,
                fontSize: '10px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              {module}
            </Typography>
          </Box>

          <Typography
            className="label-small-regular"
            sx={{ color: 'var(--grey-400)', fontSize: '11px' }}
          >
            {actionLabel}
          </Typography>
        </Box>

        {/* Row 2: diff view or description */}
        {field_label ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <Typography
              className="label-small-medium"
              sx={{ color: 'var(--grey-400)', fontSize: '12px' }}
            >
              {field_label}
            </Typography>

            {value_before !== undefined && (
              <>
                <Typography
                  className="label-small-regular"
                  sx={{
                    color: 'var(--red-main)',
                    fontSize: '12px',
                    padding: '0 4px',
                    backgroundColor: 'var(--red-secondary-light, #fce4ec)',
                    borderRadius: '3px',
                    textDecoration: 'line-through',
                  }}
                >
                  {value_before}
                </Typography>
                <Typography
                  className="label-small-regular"
                  sx={{ color: 'var(--grey-400)', fontSize: '12px' }}
                >
                  →
                </Typography>
              </>
            )}

            {value_after !== undefined && (
              <Typography
                className="label-small-regular"
                sx={{
                  color: 'var(--green-main)',
                  fontSize: '12px',
                  padding: '0 4px',
                  backgroundColor: 'var(--green-secondary-light, #e6f4ea)',
                  borderRadius: '3px',
                }}
              >
                {value_after}
              </Typography>
            )}
          </Box>
        ) : (
          <Typography
            className="body-small-regular"
            sx={{ color: 'var(--grey-400)', fontSize: '12px', wordBreak: 'break-word' }}
          >
            {description}
          </Typography>
        )}
      </Box>

      {/* Right: exact timestamp using congregation format */}
      <Box sx={{ flexShrink: 0, textAlign: 'right', alignSelf: 'center' }}>
        <Typography
          className="label-small-regular"
          sx={{ color: 'var(--grey-350)', fontSize: '11px', whiteSpace: 'nowrap' }}
        >
          {formattedTime}
        </Typography>
      </Box>
    </Box>
  );
};

export default LogEntry;
