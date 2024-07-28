import {
  StyledTextField,
  StyledTodayTypography,
  StyledWeekBox,
} from './index.styles';
import { getWeekNumberInMonthForDate } from '@utils/date';
import { WeekBoxProps } from './index.types';

export const WeekBox = ({
  weekNumber,
  weekend,
  onChange,
  value,
}: WeekBoxProps) => {
  const handleWeekChange = (event) => {
    if (!event.target.value.match(/[^0-9]/)) {
      event.preventDefault();
    }

    onChange(weekNumber, weekend, parseInt(event.target.value));
  };
  const todaysWeekNumber = getWeekNumberInMonthForDate(new Date());
  const dayStr = new Date().toDateString().slice(0, 3);
  const isWeekend = dayStr === 'Sat' || dayStr === 'Sun';

  const color = weekend ? 'var(--weekend-meeting)' : 'var(--accent-dark)';

  return (
    <StyledWeekBox>
      <StyledTextField
        onChange={handleWeekChange}
        label={`Week ${weekNumber}`}
        height={48}
        type="number"
        value={value}
      />
      {todaysWeekNumber === weekNumber && weekend === isWeekend && (
        <StyledTodayTypography color={color} className="label-small-medium">
          {'• Today'}
        </StyledTodayTypography>
      )}
    </StyledWeekBox>
  );
};
