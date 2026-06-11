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

  /** Jump-to-today calendar button (margins normalised to 0 for layout). */
  const renderCalIcon = () => (
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
          margin: 0,
          padding: '4px',
          visibility: isCurrentPeriod ? 'hidden' : 'visible',
          pointerEvents: isCurrentPeriod ? 'none' : 'auto',
          '&:hover': { backgroundColor: 'var(--accent-150)' },
        }}
      >
        <IconDate color="var(--black)" />
      </IconButton>
    </Tooltip>
  );

  const renderArrow = (
    direction: 'prev' | 'next',
    extraSx?: Record<string, unknown>
  ) => (
    <IconButton
      aria-label={t(direction === 'prev' ? 'tr_previousPeriod' : 'tr_nextPeriod')}
      onClick={direction === 'prev' ? handleNavigatePrevious : handleNavigateNext}
      sx={{
        margin: 0,
        padding: '8px',
        borderRadius: '50%',
        '&:hover': { backgroundColor: 'var(--accent-150)' },
        '& svg': { width: '24px', height: '24px' },
        ...extraSx,
      }}
    >
      {direction === 'prev' ? (
        <IconNavigateLeft color="var(--black)" />
      ) : (
        <IconNavigateRight color="var(--black)" />
      )}
    </IconButton>
  );

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
        {tabletUp ? (
          /* Tablet+: [← arrow] [32px mirror | label | 32px cal-icon] [→ arrow]
             The inner 3-column grid mirrors the cal-icon slot on both sides so
             the label is always centred between the two arrows. */
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {renderArrow('prev')}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '32px 1fr 32px',
                alignItems: 'center',
                minWidth: '220px',
              }}
            >
              <Box />
              <Typography
                className="h2"
                sx={{ textAlign: 'center', whiteSpace: 'nowrap' }}
              >
                {periodLabel}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                {renderCalIcon()}
              </Box>
            </Box>
            {renderArrow('next')}
          </Box>
        ) : (
          /* Mobile: same 3-column grid, but the inner box grows to fill the
             space between the two edge-bled arrows (marginLeft/Right: -8px). */
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            {renderArrow('prev', { marginLeft: '-8px' })}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '32px 1fr 32px',
                alignItems: 'center',
                flex: 1,
              }}
            >
              <Box />
              <Typography
                className="h2"
                sx={{ textAlign: 'center', whiteSpace: 'nowrap' }}
              >
                {periodLabel}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                {renderCalIcon()}
              </Box>
            </Box>
            {renderArrow('next', { marginRight: '-8px' })}
          </Box>
        )}

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
