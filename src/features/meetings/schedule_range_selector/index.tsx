import { Box } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { ScheduleRangeSelectorType } from './index.types';
import useScheduleRangeSelector from './useScheduleRangeSelector';
import MenuItem from '@components/menuitem';
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
    endMonthOptions,
    handleStartMonthChange,
    startMonthOptions,
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
        {startMonthOptions.map((option) => (
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
          {endMonthOptions.map((option) => (
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
