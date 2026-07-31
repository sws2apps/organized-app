import { Box, Stack } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { IconDelete } from '@components/icons';
import Button from '@components/button';
import Dialog from '@components/dialog';
import Stepper from '@components/stepper';
import Tabs from '@components/tabs';
import TextField from '@components/textfield';
import Typography from '@components/typography';
import ScheduleEditor from './schedule_editor';
import useLocationForm from './useLocationForm';
import { LocationFormProps } from './index.types';

const LocationForm = (props: LocationFormProps) => {
  const { t } = useAppTranslation();
  const { laptopUp, tabletUp } = useBreakpoints();

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
    isSaving,
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

  const isEditing = Boolean(props.location);
  const isLastStep = isEditing || step === 1;

  const mainAction = isLastStep
    ? { label: t('tr_save'), onClick: handleSave }
    : { label: t('tr_next'), onClick: handleNext };

  const backAction =
    !isEditing && step === 1
      ? { label: t('tr_back'), onClick: () => setStep(0) }
      : { label: t('tr_cancel'), onClick: props.onClose };

  const detailsTab = (
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
          helperText={errors.name && t('tr_fillRequiredField')}
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
          helperText={errors.maxPublishers && t('tr_fillRequiredField')}
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
    <ScheduleEditor
      scheduleMode={scheduleMode}
      onModeChange={handleScheduleModeChange}
      approvedDays={approvedDays}
      selectedDay={selectedDay}
      selectedShifts={selectedShifts}
      onToggleDay={handleToggleDay}
      onSelectDay={setSelectedDay}
      onAddShift={handleAddShift}
      onRemoveShift={handleRemoveShift}
      onShiftChange={handleShiftChange}
    />
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
              { label: t('tr_details'), Component: detailsTab },
              { label: t('tr_schedule'), Component: scheduleTab },
            ]}
          />
        ) : (
          <Stack spacing="24px">
            <Stepper
              steps={[t('tr_details'), t('tr_schedule')]}
              activeStep={step}
            />
            {step === 0 ? detailsTab : scheduleTab}
          </Stack>
        )}
      </Stack>

      <Stack spacing="8px" width="100%">
        <Button variant="main" disabled={isSaving} onClick={mainAction.onClick}>
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
