import { MonthItemType } from '@features/meetings/week_selector/month_item/index.types';
import useMonthItem from '@features/meetings/week_selector/month_item/useMonthItem';
import MonthRow from '@features/meetings/week_selector/month_row';
import WeekItem from '@features/meetings/week_selector/week_item';
const MonthItem = (props: MonthItemType) => {
  const { monthName, expanded, handleToggleExpand, assigned, total } =
    useMonthItem(props);
  return (
    <MonthRow
      label={monthName}
      expanded={expanded}
      onToggle={handleToggleExpand}
      assigned={assigned}
      total={total}
    >
      {props.weeks.map((week) => (
        <WeekItem key={week} week={week} />
      ))}
    </MonthRow>
  );
};
export default MonthItem;
