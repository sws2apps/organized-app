import { Box } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { IconPersonSearch } from '@components/icons';
import Typography from '@components/typography';
import { ShiftSlotStatus, ShiftSlotType } from './index.types';

type ShiftCellProps = {
  slot: ShiftSlotType;
  interactive: boolean;
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

const ShiftCell = ({ slot, interactive, onClick }: ShiftCellProps) => {
  const { t } = useAppTranslation();

  const color = textColors[slot.status];

  return (
    <Box
      onClick={interactive ? onClick : undefined}
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '8px 24px',
        padding: '12px 16px',
        borderRadius: 'var(--radius-m)',
        ...(interactive && { cursor: 'pointer' }),
        ...cellStyles[slot.status],
      }}
    >
      <Typography className="body-small-semibold" color={color}>
        {slot.start_time} - {slot.end_time}
      </Typography>

      {slot.publishers.length > 0 && (
        <Typography className="body-small-regular" color={color}>
          {slot.publishers.join(', ')}
        </Typography>
      )}

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
    </Box>
  );
};

export default ShiftCell;
