import { KeyboardEvent, MouseEvent } from 'react';
import { Box, Collapse, SxProps, Theme } from '@mui/material';
import { useAtomValue } from 'jotai';
import { hour24FormatState } from '@states/settings';
import {
  dateFormatFriendly,
  formatDate,
  generateDateFromTime,
} from '@utils/date';
import { useAppTranslation } from '@hooks/index';
import { BadgeColor } from '@definition/app';
import { IconExpand, IconPersonSearch } from '@components/icons';
import Badge from '@components/badge';
import Button from '@components/button';
import IconButton from '@components/icon_button';
import Tooltip from '@components/tooltip';
import Typography from '@components/typography';
import { ShiftCellProps, ShiftSlotStatus, ShiftSlotType } from './index.types';

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

type CellContentProps = {
  slot: ShiftSlotType;
  color: string;
  statusLabel: string;
};

const PublisherNames = ({
  slot,
  color,
  compact,
}: Omit<CellContentProps, 'statusLabel'> & { compact?: boolean }) => (
  <Typography
    className={compact ? 'label-small-regular' : 'body-small-regular'}
    sx={{ color, minWidth: 0, overflowWrap: 'anywhere' }}
  >
    {slot.publishers.join(', ')}
  </Typography>
);

const CompactContent = ({
  slot,
  color,
  statusLabel,
  expanded,
}: CellContentProps & { expanded?: boolean }) => (
  <Collapse in={expanded} unmountOnExit>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <PublisherNames slot={slot} color={color} compact />

      {slot.status === 'partner_needed' && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <IconPersonSearch color={color} width={16} height={16} />
          <Typography className="label-small-regular" sx={{ color: color }}>
            {statusLabel}
          </Typography>
        </Box>
      )}
    </Box>
  </Collapse>
);

const FullContent = ({ slot, color, statusLabel }: CellContentProps) => (
  <Box
    sx={{
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: '8px 24px',
      minWidth: 0,
    }}
  >
    {slot.publishers.length > 0 && <PublisherNames slot={slot} color={color} />}

    {(slot.status === 'available' || slot.status === 'partner_needed') && (
      <Badge
        size="small"
        multiLine
        color={badgeColors[slot.status]}
        text={statusLabel}
        icon={
          slot.status === 'partner_needed' ? <IconPersonSearch /> : undefined
        }
        sx={{ marginInlineStart: 'auto', maxWidth: '100%' }}
      />
    )}
  </Box>
);

const getCellStyles = ({
  compact,
  interactive,
  slot: { status },
}: Pick<
  ShiftCellProps,
  'compact' | 'interactive' | 'slot'
>): SxProps<Theme> => ({
  display: compact ? 'flex' : 'grid',
  gridTemplateColumns: compact ? undefined : 'subgrid',
  gridColumn: compact ? undefined : '1 / -1',
  flexDirection: compact ? 'column' : 'row',
  flexWrap: compact ? 'nowrap' : 'wrap',
  alignItems: compact ? 'stretch' : 'center',
  gap: compact ? '4px' : '8px 24px',
  padding: compact ? '8px' : '12px 16px',
  borderRadius: 'var(--radius-m)',
  '&:focus-visible': { outline: 'var(--accent-main) auto 1px' },
  ...cellStyles[status],
  ...(interactive && {
    cursor: 'pointer',
    '&:hover': hoverStyles[status],
  }),
});

const ShiftCell = ({
  slot,
  interactive,
  compact,
  expanded,
  onToggle,
  onClick,
}: ShiftCellProps) => {
  const { t } = useAppTranslation();
  const hour24 = useAtomValue(hour24FormatState);

  const statusLabels: Record<ShiftSlotStatus, string> = {
    available: t('tr_shiftAvailable'),
    partner_needed: t('tr_partnerNeeded'),
    full: t('tr_shiftOccupied'),
    past: '',
  };

  const color = textColors[slot.status];
  const statusLabel = statusLabels[slot.status];
  const timeFormat = hour24 ? 'HH:mm' : 'h:mm aaa';
  const times = `${formatDate(generateDateFromTime(slot.start_time), timeFormat)} - ${formatDate(generateDateFromTime(slot.end_time), timeFormat)}`;
  const expandable = Boolean(compact && slot.publishers.length);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    onClick?.();
  };

  const handleToggle = (event: MouseEvent) => {
    event.stopPropagation();
    onToggle?.();
  };

  // Keeps Enter and Space on the toggle from also opening the shift.
  const handleTogglekeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.stopPropagation();
  };

  const interactiveProps = interactive
    ? { role: 'button', tabIndex: 0, onClick, onKeyDown: handleKeyDown }
    : {};

  const accessibleLabel = [
    dateFormatFriendly(slot.date),
    times,
    statusLabel,
    ...slot.publishers,
  ]
    .filter(Boolean)
    .join(', ');

  const timeLabel = (
    <Typography
      component="span"
      className={compact ? 'label-small-medium' : 'body-small-semibold'}
      sx={{
        color,
        whiteSpace: compact ? 'normal' : 'nowrap',
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {times}
    </Typography>
  );

  const cell = (
    <Box
      {...(!compact ? interactiveProps : {})}
      onClick={interactive ? onClick : undefined}
      aria-label={!compact ? accessibleLabel : undefined}
      sx={getCellStyles({ compact, interactive, slot })}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          minHeight: '20px',
          minWidth: 0,
        }}
      >
        {compact && interactive ? (
          <Button
            variant="small"
            disableAutoStretch
            ariaLabel={accessibleLabel}
            onClick={(event) => {
              event.stopPropagation();
              onClick?.();
            }}
            sx={{
              padding: 0,
              minHeight: '24px',
              minWidth: '24px',
              flex: 1,
              justifyContent: 'flex-start',
              textTransform: 'none',
              textAlign: 'start',
            }}
          >
            {timeLabel}
          </Button>
        ) : (
          timeLabel
        )}

        {expandable && (
          <IconButton
            aria-expanded={expanded}
            aria-label={t('tr_publishers')}
            onClick={handleToggle}
            onKeyDown={handleTogglekeyDown}
            sx={{
              padding: '2px',
              marginRight: '-2px',
              minHeight: '24px',
              minWidth: '24px',
              flexShrink: 0,
            }}
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
        expandable && (
          <CompactContent
            slot={slot}
            color={color}
            statusLabel={statusLabel}
            expanded={expanded}
          />
        )
      ) : (
        <FullContent slot={slot} color={color} statusLabel={statusLabel} />
      )}
    </Box>
  );

  if (!compact || !statusLabel) return cell;

  return (
    <Tooltip title={statusLabel} enterDelay={2000}>
      {cell}
    </Tooltip>
  );
};

export default ShiftCell;
