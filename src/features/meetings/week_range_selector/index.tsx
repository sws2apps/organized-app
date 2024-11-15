import { Box } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { WeekRangeSelectorType } from './index.types';
import useWeekRangeSelector from './useWeekRangeSelector';
import MenuItem from '@components/menuitem';
import Select from '@components/select';
import Tooltip from '@components/tooltip';
import Typography from '@components/typography';

const WeekRangeSelector = ({
  onEndChange,
  onStartChange,
  meeting,
}: WeekRangeSelectorType) => {
  const { t } = useAppTranslation();

  const { tabletUp } = useBreakpoints();

  const { endWeekOptions, startWeekOptions, handleStartWeekChange, startWeek } =
    useWeekRangeSelector(onStartChange, meeting);

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
        label={t('tr_startWeek')}
        defaultValue=""
        onChange={(e) => handleStartWeekChange(e.target.value as string)}
      >
        {startWeekOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            <Typography className="body-regular" color="var(--black)">
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
          label={t('tr_endWeek')}
          defaultValue=""
          disabled={startWeek.length === 0}
          onChange={(e) => onEndChange?.(e.target.value as string)}
        >
          {endWeekOptions.map((option) => (
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

export default WeekRangeSelector;
