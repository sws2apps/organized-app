import { useMemo } from 'react';
import { Box, Divider, Stack } from '@mui/material';
import { useAtomValue } from 'jotai';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { hour24FormatState } from '@states/settings';
import { generateWeekday } from '@services/i18n/translation';
import { PublicWitnessingShiftType } from '@definition/public_witnessing';
import { generateDateFromTime, formatDate } from '@utils/date';
import { IconAdd, IconDelete, IconInfo } from '@components/icons';
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
  const startValue = useMemo(
    () => generateDateFromTime(shift.start_time),
    [shift.start_time]
  );
  const endValue = useMemo(
    () => generateDateFromTime(shift.end_time),
    [shift.end_time]
  );

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <TimePicker
        label={startLabel}
        ampm={!hour24}
        value={startValue}
        onChange={(value) =>
          value && onChange('start_time', formatDate(value, 'HH:mm'))
        }
        sx={{ flex: '1 1 0', minWidth: 0 }}
      />
      <Box
        sx={{
          width: '16px',
          height: '1px',
          backgroundColor: 'var(--grey-300)',
          flexShrink: 0,
        }}
      />
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
          width: '48px',
          height: '48px',
          flexShrink: 0,
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
  const { laptopUp } = useBreakpoints();
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
            setMaxPublishers(Math.max(1, Number(e.target.value)))
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

  const scheduleTab = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: laptopUp ? 'row' : 'column',
        gap: laptopUp ? '32px' : '24px',
      }}
    >
      <Stack
        spacing="10px"
        sx={{ width: laptopUp ? '240px' : '100%', flexShrink: 0 }}
      >
        <Typography className="body-small-semibold">
          {t('tr_selectDays')}
        </Typography>

        <Box sx={dayRowStyles(false)} onClick={handleToggleEveryDay}>
          <Checkbox
            checked={everyDay}
            indeterminate={!everyDay && approvedDays.length > 0}
            label={t('tr_everyDay')}
          />
        </Box>

        {weekdayNames.map((dayName, index) => {
          const weekday = index + 1;
          return (
            <Box
              key={weekday}
              sx={dayRowStyles(weekday === selectedDay)}
              onClick={() => setSelectedDay(weekday)}
            >
              <Checkbox
                checked={approvedDays.includes(weekday)}
                onChange={() => handleToggleDay(weekday)}
                label={dayName}
              />
            </Box>
          );
        })}
      </Stack>

      {laptopUp && selectedDay !== null && (
        <Divider
          orientation="vertical"
          flexItem
          sx={{ borderColor: 'var(--accent-200)' }}
        />
      )}

      <Stack spacing="16px" sx={{ flex: 1, minWidth: 0 }}>
        {selectedDay === null && (
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
        )}
        {selectedDay !== null && (
          <>
            <Typography className="body-small-semibold">
              {t('tr_daysShifts', { dayName: weekdayNames[selectedDay - 1] })}
            </Typography>

            {selectedShifts.map((shift, index) => (
              <ShiftRow
                key={`${selectedDay}-${index}`}
                shift={shift}
                hour24={hour24}
                startLabel={t('tr_startTime')}
                endLabel={t('tr_endTime')}
                onChange={(field, value) =>
                  handleShiftChange(index, field, value)
                }
                onRemove={() => handleRemoveShift(index)}
              />
            ))}

            <Button
              variant="small"
              startIcon={<IconAdd />}
              onClick={handleAddShift}
              sx={{ alignSelf: 'flex-start' }}
            >
              {t('tr_addShift')}
            </Button>
          </>
        )}
      </Stack>
    </Box>
  );

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      sx={{ padding: '24px' }}
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
        <Typography className="h2">
          {props.location ? t('tr_PWLocationEdit') : t('tr_PWLocationAdd')}
        </Typography>

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
        {props.onDelete && (
          <Button variant="tertiary" color="red" onClick={props.onDelete}>
            {t('tr_delete')}
          </Button>
        )}
      </Stack>
    </Dialog>
  );
};

export default LocationForm;
