import { useRef, useState } from 'react';
import { Box } from '@mui/material';
import { useAtomValue } from 'jotai';
import { FIELD_SERVICE_MEETING_FIELD_MIN_WIDTH } from '@constants/index';
import { hour24FormatState } from '@states/settings';
import {
  IconCheck,
  IconClose,
  IconDelete,
  IconSearch,
} from '@components/icons';
import Button from '@components/button';
import Card from '@components/card';
import Typography from '@components/typography';
import Autocomplete from '@components/autocomplete';
import Select from '@components/select';
import MenuItem from '@components/menuitem';
import DatePicker from '@components/date_picker';
import TimePicker from '@components/time_picker';
import Divider from '@components/divider';
import TextField from '@components/textfield';
import Dialog from '@components/dialog';
import IconLoading from '@components/icon_loading';
import InfoNote from '@components/info_note';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { FIELD_SERVICE_MEETING_CATEGORY_TRANSLATION_KEYS } from '@definition/field_service_meetings';
import { MeetingFormProps } from '@features/congregation/field_service_meetings/meeting_form/index.types';
import useMeetingForm from '@features/congregation/field_service_meetings/meeting_form/useMeetingForm';

const MeetingForm = ({
  meeting,
  mode,
  onClose,
  onSave,
  onDelete,
}: MeetingFormProps) => {
  const { t } = useAppTranslation();
  const { tablet500Down } = useBreakpoints();
  const hour24 = useAtomValue(hour24FormatState);
  const formRef = useRef<HTMLFormElement>(null);
  const [similarConfirmOpen, setSimilarConfirmOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const {
    formData,
    saving,
    startDate,
    groupOptions,
    locationOptions,
    conductorOptions,
    selectedGroup,
    selectedLocation,
    isJointMeeting,
    categoryOptions,
    locationFieldLabel,
    isSimilarMeeting,
    conductorValue,
    conductorError,
    dateError,
    updateMeetingData,
    handleDateChange,
    handleTimeChange,
    handleGroupChange,
    handleLocationChange,
    handleCategoryChange,
    validate,
    handleSave,
  } = useMeetingForm(meeting, onSave);

  const handleDeleteClick = () => {
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    setDeleteConfirmOpen(false);
    if (!onDelete || deleting) return;

    setDeleting(true);
    try {
      await onDelete(meeting);
    } finally {
      setDeleting(false);
    }
  };

  // Validate (shows inline errors), warn about duplicates, then save.
  const handleDone = () => {
    if (saving || deleting) return;
    if (!validate()) {
      requestAnimationFrame(() =>
        formRef.current
          ?.querySelector<HTMLElement>('[aria-invalid="true"]')
          ?.focus()
      );
      return;
    }
    if (isSimilarMeeting) {
      setSimilarConfirmOpen(true);
      return;
    }
    handleSave();
  };

  const handleConfirmSimilar = () => {
    setSimilarConfirmOpen(false);
    handleSave();
  };

  return (
    <Card
      sx={{
        minWidth: 0,
        '& .MuiInputBase-input.Mui-disabled': {
          WebkitTextFillColor: 'var(--accent-350)',
        },
      }}
    >
      <Box
        component="form"
        ref={formRef}
        onSubmit={(event) => {
          event.preventDefault();
          handleDone();
        }}
        aria-label={t(
          mode === 'add'
            ? 'tr_addFieldServiceMeeting'
            : 'tr_editFieldServiceMeeting'
        )}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          minWidth: 0,
        }}
      >
        <Typography className="h4" color="var(--black)">
          {mode === 'add'
            ? t('tr_addFieldServiceMeeting')
            : t('tr_editFieldServiceMeeting')}
        </Typography>

        <InfoNote message={t('tr_fieldServiceMeetingDraft')} />
        <Box
          component="fieldset"
          disabled={saving || deleting}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            minWidth: 0,
            padding: 0,
            margin: 0,
            border: 0,
          }}
        >
          {/* Columns follow the editor's available width, including its sidebar. */}
          <Box
            sx={{
              display: 'grid',
              gap: '16px',
              gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${FIELD_SERVICE_MEETING_FIELD_MIN_WIDTH}px), 1fr))`,
            }}
          >
            <Autocomplete
              sx={{ width: '100%', minWidth: 0 }}
              label={t('tr_type')}
              value={formData.meeting_data.category}
              options={categoryOptions}
              disableClearable
              onChange={(_, value) => {
                if (typeof value === 'number') handleCategoryChange(_, value);
              }}
              getOptionLabel={(option) =>
                typeof option === 'number'
                  ? t(FIELD_SERVICE_MEETING_CATEGORY_TRANSLATION_KEYS[option])
                  : option
              }
              isOptionEqualToValue={(option, value) => option === value}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  {typeof option === 'number'
                    ? t(FIELD_SERVICE_MEETING_CATEGORY_TRANSLATION_KEYS[option])
                    : option}
                </Box>
              )}
            />
            <Autocomplete
              sx={{ width: '100%', minWidth: 0 }}
              label={t('tr_group')}
              options={groupOptions}
              value={selectedGroup}
              disableClearable
              onChange={(_, value) => {
                if (value && typeof value !== 'string' && !Array.isArray(value))
                  handleGroupChange(_, value);
              }}
              isOptionEqualToValue={(option, value) =>
                typeof value !== 'string' && option.id === value.id
              }
              getOptionLabel={(option) =>
                typeof option === 'string' ? option : option.label
              }
              disabled={isJointMeeting}
            />
            <Autocomplete
              sx={{ width: '100%', minWidth: 0 }}
              label={t('tr_conductor')}
              freeSolo
              autoSelect
              options={conductorOptions}
              value={conductorValue}
              onChange={(_, value) => {
                const option = Array.isArray(value) ? value.at(0) : value;
                const conductor =
                  typeof option === 'string'
                    ? option.trim()
                    : (option?.id ?? '');
                updateMeetingData({ conductor });
              }}
              isOptionEqualToValue={(option, value) =>
                (typeof option === 'string' ? option : option.id) ===
                (typeof value === 'string' ? value : value.id)
              }
              getOptionLabel={(option) =>
                typeof option === 'string' ? option : option.label
              }
              endIcon={<IconSearch />}
              error={conductorError}
              helperText={
                conductorError ? t('tr_fillRequiredField') : undefined
              }
            />
          </Box>

          <Divider color="var(--accent-200)" />
          <Typography className="h4" color="var(--grey-400)">
            {t('tr_details')}
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gap: '16px',
              gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${FIELD_SERVICE_MEETING_FIELD_MIN_WIDTH}px), 1fr))`,
            }}
          >
            <DatePicker
              label={t('tr_date')}
              value={startDate}
              onChange={handleDateChange}
              error={dateError}
              helperText={
                dateError ? t('tr_fieldServiceMeetingDateError') : undefined
              }
            />
            <TimePicker
              label={t('tr_startTime')}
              ampm={!hour24}
              value={startDate}
              onChange={handleTimeChange}
              error={dateError}
            />
            <Select
              sx={{ width: '100%', minWidth: 0 }}
              label={t('tr_location')}
              value={selectedLocation?.value ?? ''}
              onChange={(e) => {
                const nextValue = e.target.value;
                const found = locationOptions.find(
                  (opt) => opt.value === nextValue
                );
                handleLocationChange(e, found ?? null);
              }}
            >
              {locationOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    {option.icon}
                    <Typography className="body-regular">
                      {option.label}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
            <TextField
              label={locationFieldLabel}
              value={formData.meeting_data.address ?? ''}
              onChange={(event) =>
                updateMeetingData({ address: event.target.value })
              }
              sx={{ width: '100%', minWidth: 0 }}
            />
          </Box>

          <TextField
            label={t('tr_additionalInfo')}
            value={formData.meeting_data.additionalInfo ?? ''}
            onChange={(event) =>
              updateMeetingData({ additionalInfo: event.target.value })
            }
            multiline
          />
        </Box>
        <Box
          component="footer"
          className="meeting-form-actions"
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap',
            '& button': { minHeight: 'var(--touch-target-size)' },
          }}
        >
          {mode === 'edit' && onDelete && (
            <Button
              variant="secondary"
              color="red"
              disableAutoStretch
              startIcon={<IconDelete />}
              onClick={handleDeleteClick}
              disabled={saving || deleting}
              sx={{ marginInlineEnd: 'auto' }}
            >
              {t('tr_delete')}
            </Button>
          )}

          <Box
            className="meeting-form-primary-actions"
            sx={{
              display: tablet500Down ? 'grid' : 'flex',
              gridTemplateColumns: tablet500Down
                ? 'repeat(2, minmax(0, 1fr))'
                : undefined,
              alignItems: 'stretch',
              justifyContent: 'flex-end',
              gap: tablet500Down ? '8px' : '16px',
              width: tablet500Down ? '100%' : 'auto',
              marginInlineStart: tablet500Down ? 0 : 'auto',
              minWidth: 0,
              '& button': {
                minWidth: 0,
                whiteSpace: 'normal',
                overflowWrap: 'anywhere',
              },
            }}
          >
            <Button
              variant="secondary"
              disableAutoStretch
              startIcon={tablet500Down ? undefined : <IconClose />}
              onClick={onClose}
              disabled={saving || deleting}
            >
              {t('tr_cancel')}
            </Button>

            {/* Always clickable: missing fields are marked inline on click. */}
            <Button
              variant="main"
              type="submit"
              disableAutoStretch
              startIcon={
                saving ? (
                  <IconLoading />
                ) : tablet500Down ? undefined : (
                  <IconCheck />
                )
              }
              disabled={saving || deleting}
            >
              {t('tr_done')}
            </Button>
          </Box>
        </Box>

        {similarConfirmOpen && (
          <Dialog
            open
            onClose={() => setSimilarConfirmOpen(false)}
            title={t('tr_similarMeetingFound')}
            description={t('tr_similarMeetingFoundDesc')}
            actions={
              <>
                <Button variant="main" onClick={handleConfirmSimilar}>
                  {t(mode === 'add' ? 'tr_addAnyway' : 'tr_done')}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setSimilarConfirmOpen(false)}
                >
                  {t('tr_cancel')}
                </Button>
              </>
            }
          />
        )}
        {deleteConfirmOpen && (
          <Dialog
            open
            onClose={() => setDeleteConfirmOpen(false)}
            title={t('tr_deleteMeeting')}
            description={t('tr_deleteMeetingDesc')}
            actions={
              <>
                <Button
                  variant="main"
                  color="red"
                  onClick={handleConfirmDelete}
                >
                  {t('tr_delete')}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setDeleteConfirmOpen(false)}
                >
                  {t('tr_cancel')}
                </Button>
              </>
            }
          />
        )}
      </Box>
    </Card>
  );
};
export default MeetingForm;
