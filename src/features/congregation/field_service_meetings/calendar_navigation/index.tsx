import { Box } from '@mui/material';
import { IconDate } from '@components/icons';
import { FilterChip } from '@components/index';
import TabSwitcher from '@components/tab_switcher';
import DateNavigator from '@components/date_navigator';
import IconButton from '@components/icon_button';
import Tooltip from '@components/tooltip';
import useCalendarNavigation from '@features/congregation/field_service_meetings/calendar_navigation/useCalendarNavigation';
import { useAppTranslation, useBreakpoints } from '@hooks/index';

const CalendarNavigation = () => {
  const { t } = useAppTranslation();
  const { tablet500Down } = useBreakpoints();
  const {
    periodLabel,
    viewMode,
    filterId,
    visibleFilters,
    isCurrentPeriod,
    handleNavigatePrevious,
    handleNavigateNext,
    handleViewModeChange,
    handleFilterChange,
    goToToday,
  } = useCalendarNavigation();
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        minWidth: 0,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            minWidth: 0,
            maxWidth: '100%',
            // Give spare inline space to the date so tabs stay compact until they wrap.
            flex: tablet500Down ? '1 1 auto' : '999 1 auto',
          }}
        >
          <DateNavigator
            value={periodLabel}
            onBack={handleNavigatePrevious}
            onNext={handleNavigateNext}
            labelMinWidth={
              tablet500Down
                ? undefined
                : 'var(--date-navigator-label-min-width)'
            }
            badgeText={t('tr_today')}
            badgeVisible={isCurrentPeriod}
            sx={{
              width: tablet500Down ? '100%' : 'auto',
              minWidth: 0,
              maxWidth: '100%',
              alignSelf: 'flex-start',
            }}
          />
          {!isCurrentPeriod && (
            <Tooltip
              title={t(
                viewMode === 'week'
                  ? 'tr_openCurrentWeek'
                  : 'tr_openCurrentMonth'
              )}
            >
              <IconButton
                edge={false}
                aria-label={t(
                  viewMode === 'week'
                    ? 'tr_openCurrentWeek'
                    : 'tr_openCurrentMonth'
                )}
                onClick={goToToday}
              >
                <IconDate color="var(--black)" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        <TabSwitcher<'week' | 'month'>
          value={viewMode}
          onChange={handleViewModeChange}
          ariaLabel={t('tr_fieldServiceMeetings')}
          options={[
            { value: 'week', label: t('tr_week') },
            { value: 'month', label: t('tr_month') },
          ]}
          sx={{
            minWidth: 0,
            display: tablet500Down ? 'flex' : 'inline-grid',
            gridAutoFlow: 'column',
            gridAutoColumns: 'minmax(max-content, 1fr)',
            width: tablet500Down ? '100%' : 'auto',
            flexGrow: 1,
            flexShrink: 0,
            maxWidth: '100%',
          }}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        {visibleFilters.map((filter) => (
          <FilterChip
            key={filter.id}
            label={t(filter.translationKey)}
            selected={filter.id === filterId}
            onClick={() => handleFilterChange(filter.id)}
          />
        ))}
      </Box>
    </Box>
  );
};
export default CalendarNavigation;
