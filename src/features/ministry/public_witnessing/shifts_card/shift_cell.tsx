import { KeyboardEvent, MouseEvent } from 'react';
import { Box, Collapse } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { BadgeColor } from '@definition/app';
import { IconExpand, IconPersonSearch } from '@components/icons';
import Badge from '@components/badge';
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
    color={color}
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
          <Typography className="label-small-regular" color={color}>
            {statusLabel}
          </Typography>
        </Box>
      )}
    </Box>
  </Collapse>
);

const FullContent = ({ slot, color, statusLabel }: CellContentProps) => (
  <>
    {slot.publishers.length > 0 && (
      <PublisherNames slot={slot} color={color} />
    )}

    {slot.status !== 'past' && (
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
  </>
);

const ShiftCell = ({
  slot,
  interactive,
  compact,
  expanded,
  onToggle,
  onClick,
}: ShiftCellProps) => {
  const { t } = useAppTranslation();

  const statusLabels: Record<ShiftSlotStatus, string> = {
    available: t('tr_shiftAvailable'),
    partner_needed: t('tr_partnerNeeded'),
    full: t('tr_shiftOccupied'),
    past: '',
  };

  const color = textColors[slot.status];
  const statusLabel = statusLabels[slot.status];
  const times = `${slot.start_time} - ${slot.end_time}`;
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

  const interactiveProps = interactive
    ? { role: 'button', tabIndex: 0, onClick, onKeyDown: handleKeyDown }
    : {};

  const cell = (
    <Box
      {...interactiveProps}
      aria-label={compact ? [times, statusLabel].join(', ') : undefined}
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
          gap: '8px',
          minWidth: 0,
        }}
      >
        <Typography
          className={compact ? 'label-small-medium' : 'body-small-semibold'}
          color={color}
          sx={{ whiteSpace: 'nowrap' }}
        >
          {times}
        </Typography>

        {expandable && (
          <IconButton
            aria-expanded={expanded}
            aria-label={statusLabel}
            onClick={handleToggle}
            sx={{ padding: '2px', marginRight: '-2px' }}
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

      {compact
        ? expandable && (
            <CompactContent
              slot={slot}
              color={color}
              statusLabel={statusLabel}
              expanded={expanded}
            />
          )
        : (
            <FullContent
              slot={slot}
              color={color}
              statusLabel={statusLabel}
            />
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
