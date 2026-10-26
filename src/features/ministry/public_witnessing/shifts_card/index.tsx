import { useId, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { PublicWitnessingViewType } from '@definition/public_witnessing';
import Card from '@components/card';
import DateNavigator from '@components/date_navigator';
import TabSwitcher from '@components/tab_switcher';
import usePublicWitnessingPermissions from '../usePermissions';
import ArrangementForm from '../arrangement_form';
import DayView from './day_view';
import MonthView from './month_view';
import WeekView from './week_view';
import useShiftsCard from './useShiftsCard';
import { ShiftSlotType, ShiftsCardProps } from './index.types';

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
          <DateNavigator
            value={label}
            onBack={handlePrevious}
            onNext={handleNext}
            backLabel={t('tr_PWPreviousPeriod')}
            nextLabel={t('tr_PWNextPeriod')}
            labelClassName="h3"
            truncateLabel
            badgeText={t('tr_current')}
            badgeVisible={isCurrentPeriod}
            badgeAction={{
              text: t('tr_toCurrent'),
              ariaLabel: t(
                {
                  day: 'tr_openCurrentDay',
                  week: 'tr_openCurrentWeek',
                  month: 'tr_openCurrentMonth',
                }[view]
              ),
              onClick: goToToday,
            }}
            sx={{
              width: isNavigationWrapped ? '100%' : 'max-content',
              maxWidth: '100%',
              minWidth: 0,
            }}
          />
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
