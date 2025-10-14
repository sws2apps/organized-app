import { DaySelectorType } from './index.types';
import Select from '@components/select';
import useDaySelector from './useDaySelector';
import MenuItem from '@components/menuitem';
import Typography from '@components/typography';

const DaySelector = ({
  onChange,
  value = '',
  label,
  sx,
  readOnly = false,
}: DaySelectorType) => {
  const { options } = useDaySelector();

  return (
    <Select
      label={label}
      readOnly={readOnly}
      value={value}
      onChange={(e) => onChange(+e.target.value)}
      sx={{ flex: 1, ...sx }}
    >
      {options.map((weekday, index) => (
        <MenuItem key={weekday} value={String(index)}>
          <Typography>{weekday}</Typography>
        </MenuItem>
      ))}
    </Select>
  );
};

export default DaySelector;
