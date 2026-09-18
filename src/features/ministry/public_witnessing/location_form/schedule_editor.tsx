import { Box, Collapse, Stack } from '@mui/material';
import { useAtomValue } from 'jotai';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { hour24FormatState } from '@states/settings';
import { generateWeekday } from '@services/i18n/translation';
import {
  IconAdd,
  IconChevronRight,
  IconExpand,
  IconInfo,
} from '@components/icons';
import Button from '@components/button';
import Checkbox from '@components/checkbox';
import Divider from '@components/divider';
import SwitchWithLabel from '@components/switch_with_label';
import Typography from '@components/typography';
import ShiftRow from './shift_row';
import { ScheduleEditorProps } from './index.types';

const dayRowStyles = (checked: boolean) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 16px 8px 8px',
  borderRadius: 'var(--radius-m)',
  border: checked
    ? '1px solid var(--accent-main)'
    : '1px solid var(--accent-300)',
  backgroundColor: checked ? 'var(--accent-150)' : 'var(--white)',
  cursor: 'pointer',
  '&:hover': { borderColor: 'var(--accent-main)' },
  '&:focus-visible': { outline: 'var(--accent-main) auto 1px' },
  '&:hover .day-row-chevron, &:focus-within .day-row-chevron': {
    opacity: 1,
    transform: 'translateX(0)',
  },
});

const ScheduleEditor = ({
  scheduleMode,
  onModeChange,
  approvedDays,
  selectedDay,
  selectedShifts,
  onToggleDay,
  onSelectDay,
  onAddShift,
  onRemoveShift,
  onShiftChange,
}: ScheduleEditorProps) => {
  const { t } = useAppTranslation();
  const { laptopUp } = useBreakpoints();
  const hour24 = useAtomValue(hour24FormatState);
  const weekdayNames = generateWeekday();

  const shiftsEditor = (
    <>
      {selectedShifts.map((shift, index) => (
        <ShiftRow
          key={shift.id}
          shift={shift}
          hour24={hour24}
          startLabel={t('tr_startTime')}
          endLabel={t('tr_endTime')}
          onChange={(field, value) => onShiftChange(index, field, value)}
          onRemove={() => onRemoveShift(index)}
        />
      ))}

      <Button
        variant="small"
        disableAutoStretch
        startIcon={<IconAdd />}
        onClick={onAddShift}
        sx={{ alignSelf: 'flex-start' }}
      >
        {t('tr_addShift')}
      </Button>
    </>
  );

  const handleDayRowClick = (weekday: number, expanded: boolean) => {
    if (!approvedDays.includes(weekday)) {
      onToggleDay(weekday);
      return;
    }
    onSelectDay(expanded ? null : weekday);
  };

  const dayRow = (weekday: number, dayName: string, expanded: boolean) => (
    <Box
      role="button"
      tabIndex={0}
      aria-expanded={approvedDays.includes(weekday) ? expanded : undefined}
      sx={dayRowStyles(expanded)}
      onClick={() => handleDayRowClick(weekday, expanded)}
      onKeyDown={(event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        handleDayRowClick(weekday, expanded);
      }}
    >
      <Checkbox
        checked={approvedDays.includes(weekday)}
        onChange={() => onToggleDay(weekday)}
        label={dayName}
        stopPropagation
        sx={{ marginLeft: 0 }}
      />

      {approvedDays.includes(weekday) && !laptopUp && (
        <Box
          aria-hidden
          sx={{
            marginLeft: 'auto',
            display: 'flex',
            transform: expanded ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.25s ease',
          }}
        >
          <IconExpand
            color={expanded ? 'var(--accent-dark)' : 'var(--grey-350)'}
          />
        </Box>
      )}

      {laptopUp && (
        <Box
          aria-hidden
          className="day-row-chevron"
          sx={{
            marginLeft: 'auto',
            display: 'flex',
            opacity: 0,
            transform: 'translateX(-4px)',
            transition: 'opacity 0.16s ease-out, transform 0.16s ease-out',
          }}
        >
          <IconChevronRight
            color={expanded ? 'var(--accent-dark)' : 'var(--grey-350)'}
            width={20}
            height={20}
          />
        </Box>
      )}
    </Box>
  );

  const daySelector = (
    <Stack
      spacing="10px"
      sx={{ width: laptopUp ? '240px' : '100%', flexShrink: 0 }}
    >
      <Typography className="body-small-semibold">
        {t('tr_selectDays')}
      </Typography>

      {weekdayNames.map((dayName, index) => {
        const weekday = index + 1;
        const expanded = weekday === selectedDay;

        if (laptopUp)
          return <Box key={weekday}>{dayRow(weekday, dayName, expanded)}</Box>;

        return (
          <Box key={weekday}>
            {dayRow(weekday, dayName, expanded)}

            <Collapse in={expanded} timeout={250} unmountOnExit>
              <Stack spacing="10px" sx={{ padding: '14px 0 8px' }}>
                {shiftsEditor}
              </Stack>
            </Collapse>
          </Box>
        );
      })}
    </Stack>
  );

  const customSchedule = !laptopUp ? (
    daySelector
  ) : (
    <Box sx={{ display: 'flex', gap: '32px' }}>
      {daySelector}

      <Divider orientation="vertical" flexItem color="var(--accent-200)" />

      <Stack spacing="16px" sx={{ flex: 1, minWidth: 0 }}>
        {selectedDay === null ? (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <IconInfo color="var(--grey-350)" />
            <Typography className="body-small-regular" color="var(--grey-400)">
              {t('tr_PWScheduleSelectDay')}
            </Typography>
          </Box>
        ) : (
          <>
            <Typography className="body-small-semibold">
              {t('tr_daysShifts', { dayName: weekdayNames[selectedDay - 1] })}
            </Typography>
            {shiftsEditor}
          </>
        )}
      </Stack>
    </Box>
  );

  return (
    <Stack spacing="16px">
      <SwitchWithLabel
        label={t('tr_everyDay')}
        helper={t('tr_everyDayDesc')}
        checked={scheduleMode === 'every_day'}
        onChange={(checked) => onModeChange(checked ? 'every_day' : 'custom')}
      />

      {scheduleMode === 'every_day' ? (
        <Stack spacing="10px">
          <Typography className="body-small-semibold">
            {t('tr_GeneralTimeRules')}
          </Typography>
          {shiftsEditor}
        </Stack>
      ) : (
        customSchedule
      )}
    </Stack>
  );
};

export default ScheduleEditor;
