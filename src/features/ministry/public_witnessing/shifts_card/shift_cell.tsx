import { KeyboardEvent, MouseEvent } from 'react';
import { Box, Collapse } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { BadgeColor } from '@definition/app';
import { IconExpand, IconPersonSearch } from '@components/icons';
import Badge from '@components/badge';
import IconButton from '@components/icon_button';
import Tooltip from '@components/tooltip';
import Typography from '@components/typography';
import { ShiftSlotStatus, ShiftSlotType } from './index.types';

type ShiftCellProps = {
  slot: ShiftSlotType;
  interactive: boolean;
  /**
   * Narrow layout for the week columns: the times and the names stack, and
   * the names hide behind the expand chevron.
   */
  compact?: boolean;
  expanded?: boolean;
  onToggle?: VoidFunction;
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
  expanded,
  onToggle,
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

  const hasPublishers = slot.publishers.length > 0;

  // In the week columns the names live behind a chevron so every cell keeps
  // the same collapsed height.
  const expandable = compact && hasPublishers;

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

  const names = (
    <Typography className="body-small-regular" color={color}>
      {slot.publishers.join(', ')}
    </Typography>
  );

  const cell = (
    <Box
      {...interactiveProps}
      // The week columns hide the names and the badge, so the state has to
      // reach screen readers through the label instead of the colour alone.
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
        '&:focus-visible': { outline: 'var(--accent-main) auto 1px' },
        ...cellStyles[slot.status],
        ...(interactive && {
          cursor: 'pointer',
          '&:hover': hoverStyles[slot.status],
        }),
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '4px',
          minWidth: 0,
        }}
      >
        <Typography
          className="body-small-semibold"
          color={color}
          sx={{ whiteSpace: 'nowrap' }}
        >
          {slot.start_time} - {slot.end_time}
        </Typography>

        {expandable && (
          <IconButton
            aria-expanded={expanded}
            aria-label={t('tr_shiftOccupied')}
            onClick={(event: MouseEvent) => {
              event.stopPropagation();
              onToggle?.();
            }}
            sx={{ padding: '2px' }}
          >
            <IconExpand
              color={color}
              width={16}
              height={16}
              sx={{
                transform: expanded ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.16s ease-out',
              }}
            />
          </IconButton>
        )}
      </Box>

      {compact ? (
        <>
          {expandable && (
            <Collapse in={expanded} unmountOnExit>
              <Box
                sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
              >
                {names}
                {slot.status === 'partner_needed' && (
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <IconPersonSearch color={color} width={16} height={16} />
                    <Typography className="label-small-medium" color={color}>
                      {statusLabel}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Collapse>
          )}

          {slot.status === 'available' && (
            <Badge
              size="small"
              color="accent"
              text={statusLabel}
              centerContent
              sx={{ alignSelf: 'flex-start' }}
            />
          )}
        </>
      ) : (
        <>
          {hasPublishers && names}

          {slot.status !== 'past' && (
            <Badge
              size="small"
              color={badgeColors[slot.status]}
              text={statusLabel}
              icon={
                slot.status === 'partner_needed' ? (
                  <IconPersonSearch />
                ) : undefined
              }
              sx={{ marginLeft: 'auto' }}
            />
          )}
        </>
      )}
    </Box>
  );

  if (!compact || !statusLabel) return cell;

  return <Tooltip title={statusLabel}>{cell}</Tooltip>;
};

export default ShiftCell;
