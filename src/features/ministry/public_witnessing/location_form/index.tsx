import { useMemo } from 'react';
import { Box, Collapse, Stack } from '@mui/material';
import { useAtomValue } from 'jotai';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { hour24FormatState } from '@states/settings';
import { generateWeekday } from '@services/i18n/translation';
import { PublicWitnessingShiftType } from '@definition/public_witnessing';
import { generateDateFromTime, formatDate } from '@utils/date';
import {
  IconAdd,
  IconChevronRight,
  IconDelete,
  IconExpand,
  IconInfo,
} from '@components/icons';
import Button from '@components/button';
import Checkbox from '@components/checkbox';
import Divider from '@components/divider';
import Dialog from '@components/dialog';
import IconButton from '@components/icon_button';
import Stepper from '@components/stepper';
import SwitchWithLabel from '@components/switch_with_label';
import Tabs from '@components/tabs';
import TextField from '@components/textfield';
import TimePicker from '@components/time_picker';
import Typography from '@components/typography';
import useLocationForm, { EditableShiftType } from './useLocationForm';
import { LocationFormProps } from './index.types';

type ShiftRowProps = {
  shift: EditableShiftType;
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
  '&:hover .day-row-chevron': { opacity: 1, transform: 'translateX(0)' },
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
    scheduleMode,
    handleScheduleModeChange,
    approvedDays,
    selectedDay,
    selectedShifts,
    errors,
    step,
    setStep,
    handleNext,
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
          error={errors.name}
          helperText={errors.name ? t('tr_fillRequiredField') : undefined}
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
          error={errors.maxPublishers}
          helperText={
            errors.maxPublishers ? t('tr_fillRequiredField') : undefined
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
          key={shift.id}
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

  const modeSwitcher = (
    <SwitchWithLabel
      label={t('tr_everyDay')}
      helper={t('tr_everyDayDesc')}
      checked={scheduleMode === 'every_day'}
      onChange={(checked) =>
        handleScheduleModeChange(checked ? 'every_day' : 'custom')
      }
    />
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

  const handleDayRowClick = (weekday: number, expanded: boolean) => {
    if (!approvedDays.includes(weekday)) {
      handleToggleDay(weekday);
      return;
    }
    setSelectedDay(expanded ? null : weekday);
  };

  const dayRow = (weekday: number, dayName: string, expanded: boolean) => (
    <Box
      sx={dayRowStyles(expanded)}
      onClick={() => handleDayRowClick(weekday, expanded)}
    >
      {dayCheckbox(weekday, dayName)}

      {approvedDays.includes(weekday) && !laptopUp && (
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

      {laptopUp && (
        <Box
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

  const isEditing = Boolean(props.location);
  const isLastStep = isEditing || step === 1;

  const mainAction = isLastStep
    ? { label: t('tr_save'), onClick: handleSave }
    : { label: t('tr_next'), onClick: handleNext };

  const backAction =
    !isEditing && step === 1
      ? { label: t('tr_back'), onClick: () => setStep(0) }
      : { label: t('tr_cancel'), onClick: props.onClose };

  const scheduleTab = (
    <Stack spacing="16px">
      {modeSwitcher}

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
            {isEditing ? t('tr_PWLocationEdit') : t('tr_PWLocationAdd')}
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

        {isEditing ? (
          <Tabs
            value={step}
            onChange={setStep}
            tabs={[
              { label: t('tr_details'), Component: generalTab },
              { label: t('tr_schedule'), Component: scheduleTab },
            ]}
          />
        ) : (
          <Stack spacing="24px">
            <Stepper
              steps={[t('tr_details'), t('tr_schedule')]}
              activeStep={step}
            />
            {step === 0 ? generalTab : scheduleTab}
          </Stack>
        )}
      </Stack>

      <Stack spacing="8px" width="100%">
        <Button variant="main" onClick={mainAction.onClick}>
          {mainAction.label}
        </Button>
        <Button variant="secondary" onClick={backAction.onClick}>
          {backAction.label}
        </Button>
      </Stack>
    </Dialog>
  );
};

export default LocationForm;
