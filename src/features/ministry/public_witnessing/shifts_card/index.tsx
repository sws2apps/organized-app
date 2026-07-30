import { useState } from 'react';
import { Box } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { PublicWitnessingViewType } from '@definition/public_witnessing';
import {
  IconDate,
  IconNavigateLeft,
  IconNavigateRight,
} from '@components/icons';
import Card from '@components/card';
import Divider from '@components/divider';
import IconButton from '@components/icon_button';
import TabSwitcher from '@components/tab_switcher';
import Tooltip from '@components/tooltip';
import Typography from '@components/typography';
import usePublicWitnessingPermissions from '../usePermissions';
import ArrangementForm from '../arrangement_form';
import DayView from './day_view';
import MonthView from './month_view';
import WeekView from './week_view';
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
    view,
    label,
    isCurrentPeriod,
    days,
    handlePrevious,
    handleNext,
    goToToday,
    handleViewChange,
    handleSelectDay,
  } = useShiftsCard({ location });

  const [openSlot, setOpenSlot] = useState<ShiftSlotType | null>(null);

  const canInteract = (slot: ShiftSlotType) => {
    if (slot.status === 'past') return false;
    if (canManageLocations) return true;
    if (slot.myArrangement) return true;
    return slot.status === 'available' || slot.status === 'partner_needed';
  };

  const viewProps = {
    days,
    canInteract,
    onSelectSlot: (slot: ShiftSlotType) => setOpenSlot(slot),
  };

  return (
    <Card sx={{ padding: laptopUp ? '24px' : '16px', gap: '24px' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: tabletUp ? 'row' : 'column',
          flexWrap: 'wrap',
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
          <IconButton onClick={handlePrevious} sx={arrowButtonStyles}>
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
              {label}
            </Typography>
            <Tooltip show={!isCurrentPeriod} title={t('tr_today')}>
              <IconButton
                onClick={goToToday}
                aria-hidden={isCurrentPeriod}
                tabIndex={isCurrentPeriod ? -1 : 0}
                sx={{
                  marginLeft: '16px',
                  padding: '4px',
                  visibility: isCurrentPeriod ? 'hidden' : 'visible',
                  pointerEvents: isCurrentPeriod ? 'none' : 'auto',
                }}
              >
                <IconDate color="var(--black)" />
              </IconButton>
            </Tooltip>
          </Box>

          <IconButton onClick={handleNext} sx={arrowButtonStyles}>
            <IconNavigateRight color="var(--black)" />
          </IconButton>
        </Box>

        <Box
          sx={{
            alignSelf: tabletUp ? 'center' : 'stretch',
            flexGrow: 1,
            display: 'flex',
            justifyContent: 'flex-end',
            minWidth: '260px',
          }}
        >
          <TabSwitcher<PublicWitnessingViewType>
            value={view}
            onChange={handleViewChange}
            options={[
              { value: 'day', label: t('tr_day') },
              { value: 'week', label: t('tr_week') },
              { value: 'month', label: t('tr_month') },
            ]}
            sx={{
              width: tabletUp ? '320px' : '100%',
              maxWidth: '100%',
            }}
          />
        </Box>
      </Box>

      <Divider color="var(--accent-200)" />

      {view === 'day' && <DayView {...viewProps} />}
      {view === 'week' && <WeekView {...viewProps} />}
      {view === 'month' && (
        <MonthView days={days} onSelectDay={handleSelectDay} />
      )}

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
