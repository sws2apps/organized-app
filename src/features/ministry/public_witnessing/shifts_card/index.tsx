import { useId, useRef, useState } from 'react';
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
  flexShrink: 0,
  borderRadius: '50%',
  '&:hover': { backgroundColor: 'var(--accent-150)' },
  '& svg': { width: '24px', height: '24px' },
};

const ShiftsCard = ({ location }: ShiftsCardProps) => {
  const { t } = useAppTranslation();
  const { laptopUp } = useBreakpoints();
  const { canManageLocations, userUID } = usePublicWitnessingPermissions();

  const {
    navigationRef,
    isNavigationWrapped,
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

  const tabsId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  const [openSlot, setOpenSlot] = useState<ShiftSlotType | null>(null);

  const canInteract = (slot: ShiftSlotType) => {
    if (slot.status === 'past') return false;
    if (canManageLocations) return true;
    if (slot.myArrangement) return true;
    if (
      slot.arrangements.some((arrangement) =>
        arrangement.arrangement_data.publishers.some(
          (publisher) => publisher.person_uid === userUID
        )
      )
    ) {
      return false;
    }
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
        ref={navigationRef}
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          minWidth: 0,
        }}
      >
        <Box
          sx={{
            flex: '999 1 auto',
            minWidth: 0,
            maxWidth: '100%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              width: isNavigationWrapped ? '100%' : 'max-content',
              maxWidth: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '16px',
              minWidth: 0,
            }}
          >
            <IconButton
              edge={false}
              aria-label={t('tr_PWPreviousPeriod')}
              onClick={handlePrevious}
              sx={arrowButtonStyles}
            >
              <IconNavigateLeft color="var(--black)" />
            </IconButton>

            <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
              <Typography
                className="h3"
                title={label}
                sx={{
                  textAlign: 'center',
                  minWidth: 0,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {label}
              </Typography>
              <Tooltip show={!isCurrentPeriod} title={t('tr_today')}>
                <IconButton
                  edge={false}
                  aria-label={t('tr_today')}
                  onClick={goToToday}
                  aria-hidden={isCurrentPeriod}
                  tabIndex={isCurrentPeriod ? -1 : 0}
                  sx={{
                    marginInlineStart: '16px',
                    padding: '4px',
                    visibility: isCurrentPeriod ? 'hidden' : 'visible',
                    pointerEvents: isCurrentPeriod ? 'none' : 'auto',
                  }}
                >
                  <IconDate color="var(--black)" />
                </IconButton>
              </Tooltip>
            </Box>

            <IconButton
              edge={false}
              aria-label={t('tr_PWNextPeriod')}
              onClick={handleNext}
              sx={arrowButtonStyles}
            >
              <IconNavigateRight color="var(--black)" />
            </IconButton>
          </Box>
        </Box>

        <TabSwitcher<PublicWitnessingViewType>
          id={tabsId}
          value={view}
          onChange={handleViewChange}
          options={[
            { value: 'day', label: t('tr_day') },
            { value: 'week', label: t('tr_week') },
            { value: 'month', label: t('tr_month') },
          ]}
          sx={{
            display: 'inline-grid',
            gridAutoFlow: 'column',
            gridAutoColumns: 'minmax(0, 1fr)',
            width: 'max-content',
            flex: '1 0 auto',
            minWidth: 0,
            maxWidth: '100%',
          }}
        />
      </Box>

      <Divider color="var(--accent-200)" />

      <Box
        ref={panelRef}
        tabIndex={-1}
        role="tabpanel"
        id={`${tabsId}-panel`}
        aria-labelledby={`${tabsId}-tab-${view}`}
        sx={{ minWidth: 0 }}
      >
        {view === 'day' && <DayView {...viewProps} />}
        {view === 'week' && <WeekView {...viewProps} />}
        {view === 'month' && (
          <MonthView
            days={days}
            onSelectDay={(date) => {
              handleSelectDay(date);
              requestAnimationFrame(() => panelRef.current?.focus());
            }}
          />
        )}
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
