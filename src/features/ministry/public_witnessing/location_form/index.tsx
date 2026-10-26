import { useRef } from 'react';
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
  const formRef = useRef<HTMLDivElement>(null);
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
    saveError,
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
          required
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
          required
          slotProps={{ htmlInput: { min: 1, step: 1 } }}
          label={t('tr_maxPublisherLabel')}
          type="number"
          value={maxPublishers}
          onChange={(e) =>
            setMaxPublishers(
              e.target.value === '' ? '' : Number(e.target.value)
            )
          }
          error={errors.maxPublishers}
          helperText={errors.maxPublishers && t('tr_PWInvalidCapacity')}
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
      title={isEditing ? t('tr_PWLocationEdit') : t('tr_PWLocationAdd')}
      header={
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <Typography component="h2" className="h2">
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
      }
      actions={
        <Stack spacing="8px" sx={{ width: '100%' }}>
          <Button
            variant="main"
            disabled={isSaving}
            onClick={async () => {
              const invalidField = formRef.current?.querySelector<HTMLElement>(
                '[aria-invalid="true"]'
              );
              if (invalidField) {
                const focusTarget =
                  invalidField.querySelector<HTMLElement>(
                    '[role="spinbutton"], input'
                  ) ?? invalidField;
                focusTarget.focus();
                return;
              }
              await mainAction.onClick();
              requestAnimationFrame(() => {
                formRef.current
                  ?.querySelector<HTMLElement>('[aria-invalid="true"]')
                  ?.focus();
              });
            }}
          >
            {mainAction.label}
          </Button>
          <Button variant="secondary" onClick={backAction.onClick}>
            {backAction.label}
          </Button>
        </Stack>
      }
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
      <Stack ref={formRef} spacing="16px" sx={{ width: '100%' }}>
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
        {saveError && (
          <Typography role="alert" sx={{ color: 'var(--red-dark)' }}>
            {t(saveError)}
          </Typography>
        )}
      </Stack>
    </Dialog>
  );
};

export default LocationForm;
