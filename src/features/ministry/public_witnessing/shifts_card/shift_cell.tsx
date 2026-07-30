import { KeyboardEvent } from 'react';
import { Box } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { IconPersonSearch } from '@components/icons';
import Typography from '@components/typography';
import { ShiftSlotStatus, ShiftSlotType } from './index.types';

type ShiftCellProps = {
  slot: ShiftSlotType;
  interactive: boolean;
  /**
   * Narrow layout for the week columns: the times and the names stack, and the
   * status is carried by the colours and the partner icon alone.
   */
  compact?: boolean;
  onClick?: VoidFunction;
};

const cellStyles: Record<ShiftSlotStatus, object> = {
  available: {
    backgroundColor: 'var(--white)',
    border: '1px solid var(--accent-main)',
    '&:hover': { backgroundColor: 'var(--accent-100)' },
  },
  partner_needed: {
    backgroundColor: 'var(--orange-secondary)',
    border: '1px solid var(--orange-main)',
  },
  full: {
    backgroundColor: 'var(--white)',
    border: '1px dashed var(--accent-300)',
    '&:hover': { backgroundColor: 'var(--accent-100)' },
  },
  past: {
    backgroundColor: 'var(--grey-100)',
    border: '1px solid var(--grey-200)',
    opacity: 0.7,
  },
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

  return (
    <Box
      {...interactiveProps}
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
        ...(interactive && { cursor: 'pointer' }),
        '&:focus-visible': { outline: 'var(--accent-main) auto 1px' },
        ...cellStyles[slot.status],
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

          {/* In the week columns the label does not fit — the icon alone
              carries the partner-needed state beside the names. */}
          {compactPartnerIcon && (
            <Box sx={{ display: 'inline-flex', flexShrink: 0 }}>
              <IconPersonSearch color={color} width={16} height={16} />
            </Box>
          )}
        </Box>
      )}

      {!compact && (
        <Box
          sx={{
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {slot.status === 'available' && (
            <Typography
              className="label-small-medium"
              color="var(--accent-dark)"
              sx={{
                backgroundColor: 'var(--accent-150)',
                borderRadius: 'var(--radius-s)',
                padding: '2px 8px',
              }}
            >
              {t('tr_shiftAvailable')}
            </Typography>
          )}
          {slot.status === 'partner_needed' && (
            <>
              <IconPersonSearch color={color} width={20} height={20} />
              <Typography className="label-small-medium" color={color}>
                {t('tr_partnerNeeded')}
              </Typography>
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ShiftCell;
