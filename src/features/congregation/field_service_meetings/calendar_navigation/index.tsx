import { Box } from '@mui/material';
import {
  IconNavigateLeft,
  IconNavigateRight,
  IconCalendar,
} from '@components/icons';
import { ButtonGroup, FilterChip, Typography } from '@components/index';
import IconButton from '@components/icon_button';
import useCalendarNavigation from './useCalendarNavigation';
import { useAppTranslation } from '@hooks/index';

/**
 * Calendar Navigation Component
 * Displays date navigation, view mode toggle, and filters for field service meetings
 */
const CalendarNavigation = () => {
  const { t } = useAppTranslation();

  const {
    weekRangeLabel,
    viewMode,
    filterId,
    visibleFilters,
    handleNavigatePrevious,
    handleNavigateNext,
    handleViewModeChange,
    handleFilterChange,
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
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: '16px' }}>
          <IconButton
            onClick={handleNavigatePrevious}
            sx={{
              padding: '8px',
              '& svg': {
                width: '24px',
                height: '24px',
              },
            }}
          >
            <IconNavigateLeft color="var(--black)" />
          </IconButton>
          <Box display="flex" alignItems="center">
            <Typography
              className="h2"
              sx={{ textAlign: 'center', minWidth: '180px' }}
            >
              {weekRangeLabel}
            </Typography>
            <IconCalendar sx={{ marginLeft: '16px' }} />
          </Box>
          <IconButton
            onClick={handleNavigateNext}
            sx={{
              padding: '8px',
              '& svg': {
                width: '24px',
                height: '24px',
              },
            }}
          >
            <IconNavigateRight color="var(--black)" />
          </IconButton>
        </Box>

        <Box>
          <ButtonGroup
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
