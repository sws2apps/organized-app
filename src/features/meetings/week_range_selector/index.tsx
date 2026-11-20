import { Box } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import MenuItem from '@components/menuitem';
import MenuSubHeader from '@components/menu_sub_header';
import Select from '@components/select';
import Tooltip from '@components/tooltip';
import Typography from '@components/typography';
import useWeekRangeSelector from './useWeekRangeSelector';
import { WeekRangeSelectorType } from './index.types';

const WeekRangeSelector = ({
  disabled = false,
  onEndChange,
  onStartChange,
  meeting,
  startWeek: controlledStart,
  endWeek,
}: WeekRangeSelectorType) => {
  const { t } = useAppTranslation();

  const { tabletUp } = useBreakpoints();

  const {
    endWeekOptions: [endPastWeeks, endUpcomingWeeks],
    startWeekOptions: [startPastWeeks, startUpcomingWeeks],
    handleStartWeekChange,
    startWeek,
    showDateLabel,
  } = useWeekRangeSelector(onStartChange, meeting, controlledStart);

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: tabletUp ? 'row' : 'column',
        gap: '16px',
      }}
    >
      <Select
        disabled={disabled}
        label={showDateLabel ? t('tr_startDate') : t('tr_startWeek')}
        inputProps={{
          'aria-label': showDateLabel ? t('tr_startDate') : t('tr_startWeek'),
        }}
        value={startWeek}
        onChange={(e) => handleStartWeekChange(e.target.value as string)}
      >
        <MenuSubHeader>{t('tr_upcomingDates')}</MenuSubHeader>
        {startUpcomingWeeks.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            <Typography
              className="body-regular"
              sx={{
                color: 'var(--black)',
              }}
            >
              {option.label}
            </Typography>
          </MenuItem>
        ))}

        <MenuSubHeader>{t('tr_pastDates')}</MenuSubHeader>
        {startPastWeeks.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            <Typography
              className="body-regular"
              sx={{
                color: 'var(--black)',
              }}
            >
              {option.label}
            </Typography>
          </MenuItem>
        ))}
      </Select>

      <Tooltip
        show={startWeek.length === 0}
        title={t('tr_dateRangeSelectStart')}
        sx={{ width: '100%' }}
      >
        <Select
          label={showDateLabel ? t('tr_endDate') : t('tr_endWeek')}
          inputProps={{
            'aria-label': showDateLabel ? t('tr_endDate') : t('tr_endWeek'),
          }}
          value={endWeek}
          defaultValue={endWeek === undefined ? '' : undefined}
          disabled={disabled || startWeek.length === 0}
          onChange={(e) => onEndChange?.(e.target.value as string)}
        >
          <MenuSubHeader>{t('tr_upcomingDates')}</MenuSubHeader>
          {endUpcomingWeeks.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Typography
                className="body-regular"
                sx={{
                  color: 'var(--black)',
                }}
              >
                {option.label}
              </Typography>
            </MenuItem>
          ))}

          <MenuSubHeader>{t('tr_pastDates')}</MenuSubHeader>
          {endPastWeeks.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Typography
                className="body-regular"
                sx={{
                  color: 'var(--black)',
                }}
              >
                {option.label}
              </Typography>
            </MenuItem>
          ))}
        </Select>
      </Tooltip>
    </Box>
  );
};

export default WeekRangeSelector;
