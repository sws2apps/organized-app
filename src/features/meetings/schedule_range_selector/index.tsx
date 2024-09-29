import { Box } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { ScheduleRangeSelectorType } from './index.types';
import useScheduleRangeSelector from './useScheduleRangeSelector';
import Select from '@components/select';
import MenuItem from '@components/menuitem';
import Typography from '@components/typography';

const ScheduleRangeSelector = ({
  onEndChange,
  onStartChange,
}: ScheduleRangeSelectorType) => {
  const { t } = useAppTranslation();

  const { tabletUp } = useBreakpoints();

  const { endMonthOptions, handleStartMonthChange, startMonthOptions } =
    useScheduleRangeSelector(onStartChange);

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

      <Select
        label={t('tr_endMonth')}
        defaultValue=""
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
    </Box>
  );
};

export default ScheduleRangeSelector;
