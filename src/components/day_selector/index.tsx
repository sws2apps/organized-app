import { DaySelectorType } from './index.types';
import Select from '@components/select';
import useDaySeletor from './useDaySelector';
import MenuItem from '@components/menuitem';
import Typography from '@components/typography';

const DaySelector = ({ onChange, value = '', label, sx }: DaySelectorType) => {
  const { options } = useDaySeletor();

  return (
    <Select
      label={label}
      value={value}
      onChange={(e) => onChange(+e.target.value)}
      sx={{ flex: 1, ...sx }}
    >
      {options.map((weekday, index) => (
        <MenuItem key={weekday} value={String(index + 1).toString()}>
          <Typography>{weekday}</Typography>
        </MenuItem>
      ))}
    </Select>
  );
};

export default DaySelector;
