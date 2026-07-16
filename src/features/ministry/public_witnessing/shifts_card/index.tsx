import { useState } from 'react';
import { Box, Divider } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import {
  IconDate,
  IconNavigateLeft,
  IconNavigateRight,
} from '@components/icons';
import Card from '@components/card';
import IconButton from '@components/icon_button';
import TabSwitcher from '@components/tab_switcher';
import Tooltip from '@components/tooltip';
import Typography from '@components/typography';
import usePublicWitnessingPermissions from '../usePermissions';
import ArrangementForm from '../arrangement_form';
import ShiftCell from './shift_cell';
import useShiftsCard from './useShiftsCard';
import { ShiftSlotType, ShiftsCardProps } from './index.types';

const arrowButtonStyles = {
  padding: '8px',
  borderRadius: '50%',
  '&:hover': { backgroundColor: 'var(--accent-150)' },
  '& svg': { width: '24px', height: '24px' },
};

const ShiftsCard = ({ location }: ShiftsCardProps) => {
  const { t } = useAppTranslation();
  const { laptopUp } = useBreakpoints();
  const { canManageLocations } = usePublicWitnessingPermissions();

  const {
    dateLabel,
    isToday,
    slots,
    handlePreviousDay,
    handleNextDay,
    goToToday,
  } = useShiftsCard({ location });

  const [openSlot, setOpenSlot] = useState<ShiftSlotType | null>(null);

  const canInteract = (slot: ShiftSlotType) => {
    if (slot.status === 'past') return false;
    if (canManageLocations) return true;
    if (slot.myArrangement) return true;
    return slot.status === 'available' || slot.status === 'partner_needed';
  };

  return (
    <Card sx={{ padding: laptopUp ? '24px' : '16px', gap: '24px' }}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IconButton onClick={handlePreviousDay} sx={arrowButtonStyles}>
            <IconNavigateLeft color="var(--black)" />
          </IconButton>

          <Typography className="h3">{dateLabel}</Typography>

          {!isToday && (
            <Tooltip title={t('tr_today')} delaySpeed="slow">
              <IconButton onClick={goToToday} sx={arrowButtonStyles}>
                <IconDate color="var(--accent-main)" />
              </IconButton>
            </Tooltip>
          )}

          <IconButton onClick={handleNextDay} sx={arrowButtonStyles}>
            <IconNavigateRight color="var(--black)" />
          </IconButton>
        </Box>

        <TabSwitcher
          value="day"
          onChange={() => undefined}
          options={[
            { value: 'day', label: t('tr_day') },
            { value: 'week', label: t('tr_week'), disabled: true },
            { value: 'month', label: t('tr_month'), disabled: true },
          ]}
          sx={{ minWidth: laptopUp ? '320px' : '100%' }}
        />
      </Box>

      <Divider sx={{ borderColor: 'var(--accent-200)' }} />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {slots.length === 0 && (
          <Typography className="body-small-regular" color="var(--grey-350)">
            {t('tr_noShiftsForThisDay')}
          </Typography>
        )}

        {slots.map((slot) => (
          <ShiftCell
            key={slot.start_time}
            slot={slot}
            interactive={canInteract(slot)}
            onClick={() => setOpenSlot(slot)}
          />
        ))}
      </Box>

      {openSlot && (
        <ArrangementForm
          open={true}
          onClose={() => setOpenSlot(null)}
          location={location}
          slot={openSlot}
        />
      )}
    </Card>
  );
};

export default ShiftsCard;
