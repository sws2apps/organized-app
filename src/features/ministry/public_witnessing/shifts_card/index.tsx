import { useState } from 'react';
import { Box, Divider } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import {
  IconDate,
  IconInfo,
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
  const { laptopUp, tabletUp } = useBreakpoints();
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
      {/*
        Navigation row + view toggle, following the field service meetings
        calendar layout: tablet+ is a single row with the toggle on the
        right; mobile stacks them, arrows pushed to the card edges.
      */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: tabletUp ? 'row' : 'column',
          justifyContent: tabletUp ? 'space-between' : 'flex-start',
          alignItems: tabletUp ? 'center' : 'stretch',
          gap: '12px',
          minWidth: 0,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: tabletUp ? 'flex-start' : 'space-between',
            alignItems: 'center',
            gap: tabletUp ? '16px' : 0,
            minWidth: 0,
          }}
        >
          <IconButton onClick={handlePreviousDay} sx={arrowButtonStyles}>
            <IconNavigateLeft color="var(--black)" />
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
            <Typography
              className="h3"
              sx={{
                textAlign: 'center',
                minWidth: '180px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {dateLabel}
            </Typography>
            {/*
              The jump-to-today control always reserves its slot so the
              label never shifts; it is visible only on other days.
            */}
            <Tooltip show={!isToday} title={t('tr_today')}>
              <IconButton
                onClick={goToToday}
                aria-hidden={isToday}
                tabIndex={isToday ? -1 : 0}
                sx={{
                  marginLeft: '16px',
                  padding: '4px',
                  visibility: isToday ? 'hidden' : 'visible',
                  pointerEvents: isToday ? 'none' : 'auto',
                }}
              >
                <IconDate color="var(--black)" />
              </IconButton>
            </Tooltip>
          </Box>

          <IconButton onClick={handleNextDay} sx={arrowButtonStyles}>
            <IconNavigateRight color="var(--black)" />
          </IconButton>
        </Box>

        <Box sx={{ alignSelf: tabletUp ? 'center' : 'stretch', minWidth: 0 }}>
          <TabSwitcher
            value="day"
            onChange={() => undefined}
            options={[
              { value: 'day', label: t('tr_day') },
              { value: 'week', label: t('tr_week'), disabled: true },
              { value: 'month', label: t('tr_month'), disabled: true },
            ]}
            sx={{ minWidth: tabletUp ? '320px' : 0, maxWidth: '100%' }}
          />
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'var(--accent-200)' }} />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {slots.length === 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconInfo color="var(--grey-350)" />
            <Typography className="body-small-regular" color="var(--grey-400)">
              {t('tr_noShiftsForThisDay')}
            </Typography>
          </Box>
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
