import type { WeekItemType } from '@features/meetings/week_selector/week_item/index.types';
import useWeekItem from '@features/meetings/week_selector/week_item/useWeekItem';
import WeekRow from '@features/meetings/week_selector/week_row';
const WeekItem = ({ week }: WeekItemType) => {
  const { weekDateLocale, handleSelectWeek, isSelected, assigned, total } =
    useWeekItem(week);
  return (
    <WeekRow
      label={weekDateLocale}
      onSelect={() => handleSelectWeek(week)}
      isSelected={isSelected}
      assigned={assigned}
      total={total}
    />
  );
};
export default WeekItem;
