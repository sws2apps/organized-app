import { Box } from '@mui/material';
import {
  IconNavigateLeft,
  IconNavigateRight,
  IconDate,
} from '@components/icons';
import { ButtonGroup, FilterChip, Typography } from '@components/index';
import IconButton from '@components/icon_button';
import Tooltip from '@components/tooltip';
import useCalendarNavigation from './useCalendarNavigation';
import { useAppTranslation, useBreakpoints } from '@hooks/index';

/**
 * Calendar Navigation Component
 * Displays date navigation, view mode toggle, and filters for field service meetings
 */
const CalendarNavigation = () => {
  const { t } = useAppTranslation();
  const { tabletUp } = useBreakpoints();

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
        gap: '16px',
        flexDirection: 'column',
        border: '1px solid var(--accent-300)',
        borderRadius: 'var(--radius-xl)',
        padding: '16px',
        backgroundColor: 'var(--white)',
      }}
    >
      {/*
        Navigation row + view-mode toggle.
        Tablet+ (≥ 480 px): single flex-row — [← label →] on the left,
          [Week | Month] on the right.
        Mobile (< 480 px): flex-column — [← label →] spans full width
          (arrows pushed to the edges via space-between), toggle sits below.
      */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: tabletUp ? 'row' : 'column',
          justifyContent: tabletUp ? 'space-between' : 'flex-start',
          alignItems: tabletUp ? 'center' : 'stretch',
          gap: '12px',
        }}
      >
        {/* ── Previous / label / next ── */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            // On mobile: push arrows to the edges so the label stays centred.
            justifyContent: tabletUp ? 'flex-start' : 'space-between',
            alignItems: 'center',
            gap: tabletUp ? '16px' : 0,
          }}
        >
          <IconButton
            aria-label={t('tr_previousPeriod')}
            onClick={handleNavigatePrevious}
            sx={{
              padding: '8px',
              borderRadius: '50%',
              '&:hover': { backgroundColor: 'var(--accent-150)' },
              '& svg': { width: '24px', height: '24px' },
            }}
          >
            <IconNavigateLeft color="var(--black)" />
          </IconButton>

          <Box display="flex" alignItems="center">
            <Typography
              className="h2"
              sx={{ textAlign: 'center', minWidth: '180px' }}
            >
              {periodLabel}
            </Typography>
            {/*
              The jump-to-today control always reserves its slot so the label
              never shifts horizontally; it becomes visible only when the
              displayed period is not the current one.
            */}
            <Tooltip
              show={!isCurrentPeriod}
              title={
                viewMode === 'week'
                  ? t('tr_openCurrentWeek')
                  : t('tr_openCurrentMonth')
              }
            >
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

          <IconButton
            aria-label={t('tr_nextPeriod')}
            onClick={handleNavigateNext}
            sx={{
              padding: '8px',
              borderRadius: '50%',
              '&:hover': { backgroundColor: 'var(--accent-150)' },
              '& svg': { width: '24px', height: '24px' },
            }}
          >
            <IconNavigateRight color="var(--black)" />
          </IconButton>
        </Box>

        {/* ── Week / Month toggle ── */}
        {/* Mobile: stretches to full card width; tablet+: auto-sized */}
        <Box sx={{ alignSelf: tabletUp ? 'center' : 'stretch' }}>
          <ButtonGroup
            fullWidth={!tabletUp}
            buttons={[
              {
                className: viewMode === 'week' ? 'active' : '',
                variant: 'outlined',
                children: t('tr_week'),
                onClick: () => handleViewModeChange('week'),
              },
              {
                className: viewMode === 'month' ? 'active' : '',
                variant: 'outlined',
                children: t('tr_month'),
                onClick: () => handleViewModeChange('month'),
              },
            ]}
          />
        </Box>
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
