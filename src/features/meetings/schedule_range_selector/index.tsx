import { Box } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { ScheduleRangeSelectorType } from './index.types';
import useScheduleRangeSelector from './useScheduleRangeSelector';
import MenuItem from '@components/menuitem';
import MenuSubHeader from '@components/menu_sub_header';
import Select from '@components/select';
import Tooltip from '@components/tooltip';
import Typography from '@components/typography';

const ScheduleRangeSelector = ({
  onEndChange,
  onStartChange,
}: ScheduleRangeSelectorType) => {
  const { t } = useAppTranslation();

  const { tabletUp } = useBreakpoints();

  const {
    endMonthOptions: [endPastMonths, endUpcomingMonths],
    handleStartMonthChange,
    startMonthOptions: [startPastMonths, startUpcomingMonths],
    startMonth,
  } = useScheduleRangeSelector(onStartChange);

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
        label={t('tr_startMonth')}
        defaultValue=""
        onChange={(e) => handleStartMonthChange(e.target.value as string)}
      >
        <MenuSubHeader>{t('tr_pastDates')}</MenuSubHeader>
        {startPastMonths.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            <Typography className="body-regular" color="var(--black)">
              {option.label}
            </Typography>
          </MenuItem>
        ))}

        <MenuSubHeader>{t('tr_upcomingDates')}</MenuSubHeader>
        {startUpcomingMonths.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            <Typography className="body-regular" color="var(--black)">
              {option.label}
            </Typography>
          </MenuItem>
        ))}
      </Select>

      <Tooltip
        show={startMonth.length === 0}
        title={t('tr_dateRangeSelectStart')}
        sx={{ width: '100%' }}
      >
        <Select
          label={t('tr_endMonth')}
          defaultValue=""
          disabled={startMonth.length === 0}
          onChange={(e) => onEndChange?.(e.target.value as string)}
        >
          <MenuSubHeader>{t('tr_pastDates')}</MenuSubHeader>
          {endPastMonths.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Typography className="body-regular" color="var(--black)">
                {option.label}
              </Typography>
            </MenuItem>
          ))}

          <MenuSubHeader>{t('tr_upcomingDates')}</MenuSubHeader>
          {endUpcomingMonths.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Typography className="body-regular" color="var(--black)">
                {option.label}
              </Typography>
            </MenuItem>
          ))}
        </Select>
      </Tooltip>
    </Box>
  );
};

export default ScheduleRangeSelector;
