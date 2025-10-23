import { Box } from '@mui/material';
import { MeetingTimeType } from './index.types';
import useMeetingTime from './useMeetingTime';
import MenuItem from '@components/menuitem';
import Select from '@components/select';
import TimePicker from '@components/time_picker';
import Typography from '@components/typography';

const MeetingTime = ({
  label,
  onTimeChange,
  onWeekdayChange,
  time,
  weekday,
}: MeetingTimeType) => {
  const { options } = useMeetingTime();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        flexWrap: 'wrap',
      }}
    >
      <Select
        label={label}
        value={weekday}
        onChange={(e) => onWeekdayChange(+e.target.value)}
        sx={{ flex: 1, minWidth: '150px' }}
      >
        {options.map((weekday, index) => (
          <MenuItem key={weekday} value={String(index)}>
            <Typography>{weekday}</Typography>
          </MenuItem>
        ))}
      </Select>

      <TimePicker ampm={false} value={time} onChange={onTimeChange} />
    </Box>
  );
};

export default MeetingTime;
