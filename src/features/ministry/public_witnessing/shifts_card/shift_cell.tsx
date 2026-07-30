import { KeyboardEvent } from 'react';
import { Box } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { BadgeColor } from '@definition/app';
import { IconPersonSearch } from '@components/icons';
import Badge from '@components/badge';
import Tooltip from '@components/tooltip';
import Typography from '@components/typography';
import { ShiftSlotStatus, ShiftSlotType } from './index.types';

type ShiftCellProps = {
  slot: ShiftSlotType;
  interactive: boolean;
  /**
   * Narrow layout for the week columns: the times and the names stack, and
   * the status badge gives way to the colours, the partner icon and a
   * tooltip.
   */
  compact?: boolean;
  onClick?: VoidFunction;
};

const cellStyles: Record<ShiftSlotStatus, object> = {
  available: {
    backgroundColor: 'var(--white)',
    border: '1px solid var(--accent-main)',
  },
  partner_needed: {
    backgroundColor: 'var(--orange-secondary)',
    border: '1px solid var(--orange-main)',
  },
  full: {
    backgroundColor: 'var(--white)',
    border: '1px dashed var(--accent-300)',
  },
  past: {
    backgroundColor: 'var(--grey-100)',
    border: '1px solid var(--grey-200)',
  },
};

// Only cells the user can actually open react to the pointer.
const hoverStyles: Record<ShiftSlotStatus, object> = {
  available: { backgroundColor: 'var(--accent-100)' },
  partner_needed: { borderColor: 'var(--orange-dark)' },
  full: { backgroundColor: 'var(--accent-100)' },
  past: {},
};

const badgeColors: Record<ShiftSlotStatus, BadgeColor> = {
  available: 'accent',
  partner_needed: 'orange',
  full: 'grey',
  past: 'grey',
};

const textColors: Record<ShiftSlotStatus, string> = {
  available: 'var(--accent-dark)',
  partner_needed: 'var(--orange-dark)',
  full: 'var(--accent-400)',
  past: 'var(--grey-350)',
};

const ShiftCell = ({
  slot,
  interactive,
  compact,
  onClick,
}: ShiftCellProps) => {
  const { t } = useAppTranslation();

  const color = textColors[slot.status];

  const statusLabels: Record<ShiftSlotStatus, string> = {
    available: t('tr_shiftAvailable'),
    partner_needed: t('tr_partnerNeeded'),
    full: t('tr_shiftOccupied'),
    past: '',
  };

  const statusLabel = statusLabels[slot.status];

  const compactPartnerIcon = compact && slot.status === 'partner_needed';

  const interactiveProps = interactive
    ? {
        role: 'button',
        tabIndex: 0,
        onClick,
        onKeyDown: (event: KeyboardEvent) => {
          if (event.key !== 'Enter' && event.key !== ' ') return;
          event.preventDefault();
          onClick?.();
        },
      }
    : {};

  const cell = (
    <Box
      {...interactiveProps}
      // The week columns drop the badge, so the state has to reach screen
      // readers through the label instead of the colour alone.
      aria-label={
        compact
          ? [`${slot.start_time} - ${slot.end_time}`, statusLabel]
              .filter(Boolean)
              .join(', ')
          : undefined
      }
      sx={{
        display: 'flex',
        flexDirection: compact ? 'column' : 'row',
        flexWrap: compact ? 'nowrap' : 'wrap',
        alignItems: compact ? 'stretch' : 'center',
        gap: compact ? '4px' : '8px 24px',
        padding: compact ? '8px' : '12px 16px',
        borderRadius: 'var(--radius-m)',
        // Week columns place the cells in a stretched grid row.
        ...(compact && { height: '100%' }),
        '&:focus-visible': { outline: 'var(--accent-main) auto 1px' },
        ...cellStyles[slot.status],
        ...(interactive && {
          cursor: 'pointer',
          '&:hover': hoverStyles[slot.status],
        }),
      }}
    >
      <Typography
        className="body-small-semibold"
        color={color}
        sx={{ whiteSpace: 'nowrap' }}
      >
        {slot.start_time} - {slot.end_time}
      </Typography>

      {(slot.publishers.length > 0 || compactPartnerIcon) && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            minWidth: 0,
          }}
        >
          {slot.publishers.length > 0 && (
            <Typography
              className="body-small-regular"
              color={color}
              sx={
                compact
                  ? {
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 2,
                      overflow: 'hidden',
                      wordBreak: 'break-word',
                    }
                  : undefined
              }
            >
              {slot.publishers.join(', ')}
            </Typography>
          )}

          {/* In the week columns the badge does not fit — the icon alone
              carries the partner-needed state beside the names. */}
          {compactPartnerIcon && (
            <Box sx={{ display: 'inline-flex', flexShrink: 0 }}>
              <IconPersonSearch color={color} width={16} height={16} />
            </Box>
          )}
        </Box>
      )}

      {!compact && slot.status !== 'past' && (
        <Badge
          size="small"
          color={badgeColors[slot.status]}
          text={statusLabel}
          icon={
            slot.status === 'partner_needed' ? <IconPersonSearch /> : undefined
          }
          sx={{ marginLeft: 'auto' }}
        />
      )}
    </Box>
  );

  if (!compact || !statusLabel) return cell;

  return <Tooltip title={statusLabel}>{cell}</Tooltip>;
};

export default ShiftCell;
