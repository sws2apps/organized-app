import { useMemo } from 'react';
import { Box, Collapse, Divider, Stack } from '@mui/material';
import { useAtomValue } from 'jotai';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { hour24FormatState } from '@states/settings';
import { generateWeekday } from '@services/i18n/translation';
import { PublicWitnessingShiftType } from '@definition/public_witnessing';
import { generateDateFromTime, formatDate } from '@utils/date';
import {
  IconAdd,
  IconDelete,
  IconExpand,
  IconInfo,
} from '@components/icons';
import Button from '@components/button';
import Checkbox from '@components/checkbox';
import Dialog from '@components/dialog';
import IconButton from '@components/icon_button';
import Tabs from '@components/tabs';
import TextField from '@components/textfield';
import TimePicker from '@components/time_picker';
import Typography from '@components/typography';
import useLocationForm from './useLocationForm';
import { LocationFormProps } from './index.types';

type ShiftRowProps = {
  shift: PublicWitnessingShiftType;
  hour24: boolean;
  startLabel: string;
  endLabel: string;
  onChange: (field: keyof PublicWitnessingShiftType, value: string) => void;
  onRemove: VoidFunction;
};

// Separate component so the TimePicker Date values keep a stable identity —
// the picker resets its in-progress edit whenever the value prop changes.
const ShiftRow = ({
  shift,
  hour24,
  startLabel,
  endLabel,
  onChange,
  onRemove,
}: ShiftRowProps) => {
  // Narrow screens drop the dash between the fields and slim the delete
  // button down so the times themselves never get cropped.
  const { tabletUp } = useBreakpoints();

  const startValue = useMemo(
    () => generateDateFromTime(shift.start_time),
    [shift.start_time]
  );
  const endValue = useMemo(
    () => generateDateFromTime(shift.end_time),
    [shift.end_time]
  );

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: tabletUp ? '10px' : '8px',
      }}
    >
      <TimePicker
        label={startLabel}
        ampm={!hour24}
        value={startValue}
        onChange={(value) =>
          value && onChange('start_time', formatDate(value, 'HH:mm'))
        }
        sx={{ flex: '1 1 0', minWidth: 0 }}
      />
      {tabletUp && (
        <Box
          sx={{
            width: '16px',
            height: '1px',
            backgroundColor: 'var(--grey-300)',
            flexShrink: 0,
          }}
        />
      )}
      <TimePicker
        label={endLabel}
        ampm={!hour24}
        value={endValue}
        onChange={(value) =>
          value && onChange('end_time', formatDate(value, 'HH:mm'))
        }
        sx={{ flex: '1 1 0', minWidth: 0 }}
      />
      <IconButton
        color="error"
        onClick={onRemove}
        sx={{
          borderRadius: 'var(--radius-m)',
          width: tabletUp ? '48px' : '40px',
          height: tabletUp ? '48px' : '40px',
          padding: tabletUp ? '12px' : '8px',
          flexShrink: 0,
          marginLeft: 0,
        }}
      >
        <IconDelete color="var(--red-main)" />
      </IconButton>
    </Box>
  );
};

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
});

const LocationForm = (props: LocationFormProps) => {
  const { t } = useAppTranslation();
  const { laptopUp, tabletUp } = useBreakpoints();
  const hour24 = useAtomValue(hour24FormatState);
  const weekdayNames = generateWeekday();

  const {
    name,
    setName,
    address,
    setAddress,
    cartStoredAt,
    setCartStoredAt,
    maxPublishers,
    setMaxPublishers,
    description,
    setDescription,
    everyDay,
    approvedDays,
    selectedDay,
    selectedShifts,
    isValid,
    handleToggleEveryDay,
    handleToggleDay,
    setSelectedDay,
    handleAddShift,
    handleRemoveShift,
    handleShiftChange,
    handleSave,
  } = useLocationForm(props);

  const generalTab = (
    <Stack spacing="16px">
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: laptopUp ? '1fr 1fr' : '1fr',
          gap: '16px',
        }}
      >
        <TextField
          label={t('tr_locationName')}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label={t('tr_address')}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <TextField
          label={t('tr_cartStorage')}
          value={cartStoredAt}
          onChange={(e) => setCartStoredAt(e.target.value)}
        />
        <TextField
          label={t('tr_maxPublisherLabel')}
          type="number"
          value={maxPublishers}
          onChange={(e) =>
            setMaxPublishers(
              e.target.value === '' ? '' : Math.max(1, Number(e.target.value))
            )
          }
        />
      </Box>
      <TextField
        label={t('tr_description')}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        multiline
        rows={4}
      />
    </Stack>
  );

  const shiftsEditor = (
    <>
      {selectedShifts.map((shift, index) => (
        <ShiftRow
          key={`${selectedDay}-${index}`}
          shift={shift}
          hour24={hour24}
          startLabel={t('tr_startTime')}
          endLabel={t('tr_endTime')}
          onChange={(field, value) => handleShiftChange(index, field, value)}
          onRemove={() => handleRemoveShift(index)}
        />
      ))}

      <Button
        variant="small"
        disableAutoStretch
        startIcon={<IconAdd />}
        onClick={handleAddShift}
        sx={{ alignSelf: 'flex-start' }}
      >
        {t('tr_addShift')}
      </Button>
    </>
  );

  const everyDayRow = (
    <Box sx={dayRowStyles(false)} onClick={handleToggleEveryDay}>
      <Checkbox
        checked={everyDay}
        indeterminate={!everyDay && approvedDays.length > 0}
        label={t('tr_everyDay')}
        sx={{ marginLeft: 0 }}
      />
    </Box>
  );

  const dayCheckbox = (weekday: number, dayName: string) => (
    <Checkbox
      checked={approvedDays.includes(weekday)}
      onChange={() => handleToggleDay(weekday)}
      label={dayName}
      stopPropagation
      sx={{ marginLeft: 0 }}
    />
  );

  // A day only opens once it is approved — tapping an unapproved row
  // approves it (which opens it) rather than showing an empty editor.
  const handleDayRowClick = (weekday: number, expanded: boolean) => {
    if (!approvedDays.includes(weekday)) {
      handleToggleDay(weekday);
      return;
    }
    setSelectedDay(expanded ? null : weekday);
  };

  // Mobile: the shifts editor expands inline under the selected day.
  const scheduleTab = !laptopUp ? (
    <Stack spacing="10px">
      <Typography className="body-small-semibold">
        {t('tr_selectDays')}
      </Typography>

      {everyDayRow}

      {weekdayNames.map((dayName, index) => {
        const weekday = index + 1;
        const expanded = weekday === selectedDay;
        return (
          <Box key={weekday}>
            <Box
              sx={dayRowStyles(expanded)}
              onClick={() => handleDayRowClick(weekday, expanded)}
            >
              {dayCheckbox(weekday, dayName)}
              {approvedDays.includes(weekday) && (
                <Box
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
            </Box>

            <Collapse in={expanded} timeout={250} unmountOnExit>
              <Stack spacing="10px" sx={{ padding: '14px 0 8px' }}>
                {shiftsEditor}
              </Stack>
            </Collapse>
          </Box>
        );
      })}
    </Stack>
  ) : (
    <Box sx={{ display: 'flex', gap: '32px' }}>
      <Stack spacing="10px" sx={{ width: '240px', flexShrink: 0 }}>
        <Typography className="body-small-semibold">
          {t('tr_selectDays')}
        </Typography>

        {everyDayRow}

        {weekdayNames.map((dayName, index) => {
          const weekday = index + 1;
          return (
            <Box
              key={weekday}
              sx={dayRowStyles(weekday === selectedDay)}
              onClick={() => handleDayRowClick(weekday, weekday === selectedDay)}
            >
              {dayCheckbox(weekday, dayName)}
            </Box>
          );
        })}
      </Stack>

      {selectedDay !== null && (
        <Divider
          orientation="vertical"
          flexItem
          sx={{ borderColor: 'var(--accent-200)' }}
        />
      )}

      <Stack spacing="16px" sx={{ flex: 1, minWidth: 0 }}>
        {selectedDay === null ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              height: '100%',
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
    <Dialog
      open={props.open}
      onClose={props.onClose}
      sx={{ padding: tabletUp ? '24px' : '16px' }}
      PaperProps={{
        className: 'pop-up-shadow',
        style: {
          maxWidth: '740px',
          borderRadius: 'var(--radius-xl)',
          backgroundColor: 'var(--white)',
        },
      }}
    >
      <Stack spacing="16px" width="100%">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <Typography className="h2">
            {props.location ? t('tr_PWLocationEdit') : t('tr_PWLocationAdd')}
          </Typography>
          {props.onDelete && (
            <Button
              variant="small"
              color="red"
              disableAutoStretch
              startIcon={<IconDelete color="var(--red-dark)" />}
              onClick={props.onDelete}
              sx={{ flexShrink: 0 }}
            >
              {t('tr_delete')}
            </Button>
          )}
        </Box>

        <Tabs
          tabs={[
            { label: t('tr_generalInformation'), Component: generalTab },
            { label: t('tr_schedule'), Component: scheduleTab },
          ]}
        />
      </Stack>

      <Stack spacing="8px" width="100%">
        <Button variant="main" disabled={!isValid} onClick={handleSave}>
          {t('tr_save')}
        </Button>
        <Button variant="secondary" onClick={props.onClose}>
          {t('tr_cancel')}
        </Button>
      </Stack>
    </Dialog>
  );
};

export default LocationForm;
