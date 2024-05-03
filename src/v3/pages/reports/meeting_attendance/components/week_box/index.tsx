import { TFunction } from 'i18next';
import { StyledTextField, StyledTodayTypography, StyledWeekBox } from './index.styles';
import { getWeekNumberInMonthForDate } from '@utils/date';
import { WeekBoxProps } from './index.types';

export const WeekBox = ({ weekNumber, weekend, onChange, t }: WeekBoxProps) => {
  const handleWeekChange = (event) => {
    if (!event.target.value.match(/[^0-9]/)) {
      event.preventDefault();
    }

    onChange(weekNumber, weekend, parseInt(event.target.value));
  };
  const todaysWeekNumber = getWeekNumberInMonthForDate(new Date());
  const dayNumber = new Date().getDay();
  const isWeekend = dayNumber == 5 || dayNumber == 6;

  const color = weekend ? 'var(--weekend-meeting)' : 'var(--accent-dark)';

  return (
    <StyledWeekBox>
      <StyledTextField label={`Week ${weekNumber}`} height={48} type="number" />
      {todaysWeekNumber === weekNumber && weekend === isWeekend && (
        <StyledTodayTypography onChange={handleWeekChange} color={color} className="label-small-medium">
          {'• Today'}
        </StyledTodayTypography>
      )}
    </StyledWeekBox>
  );
};
