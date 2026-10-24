import { Box } from '@mui/material';
import { useAtomValue } from 'jotai';
import { shortDateFormatState } from '@states/settings';
import { useAppTranslation } from '@hooks/index';
import WeekSelectorPanel from '@features/meetings/week_selector/panel';
import useWeekSelector from '@features/congregation/field_service_meetings/week_selector/useWeekSelector';
import ScrollableTabs from '@components/scrollable_tabs';
import Accordion from '@components/accordion';
import Button from '@components/button';
import Typography from '@components/typography';
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
      {months.map((month) => (
        <Accordion
          key={month.value}
          id={month.value}
          label={month.label}
          expanded={expandedMonth === month.value}
          onChange={setExpandedMonth}
          sx={{ borderBottom: '1px solid var(--accent-200)' }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {month.weeks.map((week) => (
              <Button
                key={week.value}
                variant="secondary"
                className="body-small-semibold"
                aria-pressed={selectedWeek === week.value}
                ariaLabel={`${formatDate(new Date(week.value), format)}, ${t('tr_fieldServiceMeetingCount', { count: week.count })}`}
                onClick={() => selectWeek(week.value)}
                sx={{
                  justifyContent: 'space-between',
                  borderRadius: 'var(--radius-none)',
                  borderTop: '1px solid var(--accent-200)',
                  padding: '8px',
                  gap: '8px',
                  minWidth: 0,
                  backgroundColor:
                    selectedWeek === week.value
                      ? 'var(--accent-150)'
                      : 'transparent',
                  color:
                    selectedWeek === week.value
                      ? 'var(--accent-dark)'
                      : 'var(--black)',
                }}
              >
                <Typography
                  sx={{ textAlign: 'start', overflowWrap: 'anywhere' }}
                >
                  {formatDate(new Date(week.value), format)}
                </Typography>
                <Typography
                  className="label-small-medium"
                  color="var(--grey-400)"
                  sx={{ flexShrink: 0 }}
                >
                  {week.count}
                </Typography>
              </Button>
            ))}
          </Box>
        </Accordion>
      ))}
    </WeekSelectorPanel>
  );
};
export default WeekSelector;
