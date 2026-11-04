import { Box } from '@mui/material';
import { useAtomValue } from 'jotai';
import { shortDateFormatState } from '@states/settings';
import { useAppTranslation } from '@hooks/index';
import WeekSelectorPanel from '@features/meetings/week_selector/panel';
import useWeekSelector from '@features/congregation/field_service_meetings/week_selector/useWeekSelector';
import ScrollableTabs from '@components/scrollable_tabs';
import MonthRow from '@features/meetings/week_selector/month_row';
import WeekRow from '@features/meetings/week_selector/week_row';
import { formatDate } from '@utils/date';

const WeekSelector = () => {
  const { t } = useAppTranslation();
  const format = useAtomValue(shortDateFormatState);
  const {
    years,
    year,
    setYear,
    months,
    selectedWeek,
    expandedMonth,
    setExpandedMonth,
    expanded,
    sortDown,
    toggleExpanded,
    toggleSort,
    selectWeek,
  } = useWeekSelector();
  return (
    <WeekSelectorPanel
      title={t('tr_fieldServiceMeetingWeeks')}
      expanded={expanded}
      sortDown={sortDown}
      onToggleExpand={toggleExpanded}
      onToggleSort={toggleSort}
    >
      <ScrollableTabs
        tabs={years.map((value) => ({ label: String(value) }))}
        value={years.indexOf(year)}
        onChange={(index) => setYear(years[index]!)}
      />
      <Box sx={{ '& > * + *': { borderTop: '1px solid var(--accent-200)' } }}>
        {months.map((month) => (
          <MonthRow
            key={month.value}
            label={month.label}
            expanded={expandedMonth === month.value}
            onToggle={() =>
              setExpandedMonth(
                expandedMonth === month.value ? false : month.value
              )
            }
            assigned={month.weeks.reduce((sum, week) => sum + week.assigned, 0)}
            total={month.weeks.reduce((sum, week) => sum + week.total, 0)}
          >
            {month.weeks.map((week) => (
              <WeekRow
                key={week.value}
                label={formatDate(new Date(week.value), format)}
                isSelected={selectedWeek === week.value}
                onSelect={() => selectWeek(week.value)}
                assigned={week.assigned}
                total={week.total}
              />
            ))}
          </MonthRow>
        ))}
      </Box>
    </WeekSelectorPanel>
  );
};
export default WeekSelector;
