import { type FC, useState } from 'react';
import { Box } from '@mui/material';
import {
  IconCheck,
  IconClose,
  IconDelete,
  IconSearch,
} from '@components/icons';
import Button from '@components/button';
import Typography from '@components/typography';
import Autocomplete from '@components/autocomplete';
import Select from '@components/select';
import MenuItem from '@components/menuitem';
import DatePicker from '@components/date_picker';
import TimePicker from '@components/time_picker';
import Divider from '@components/divider';
import TextField from '@components/textfield';
import Dialog from '@components/dialog';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import {
  FieldServiceMeetingCategory,
  FieldServiceMeetingType,
  FIELD_SERVICE_MEETING_CATEGORY_TRANSLATION_KEYS,
} from '@definition/field_service_meetings';
import type { ConductorOption, GroupOption } from '../index.types';
import useMeetingForm from './useMeetingForm';

type FieldServiceMeetingFormProps = {
  meeting: FieldServiceMeetingType;
  mode: 'edit' | 'add';
  onClose: () => void;
  onSave: (meeting: FieldServiceMeetingType) => Promise<void> | void;
  onDelete?: (meeting: FieldServiceMeetingType) => Promise<void> | void;
};

/**
 * FieldServiceMeetingForm
 *
 * Presentation component for field service meeting creation/editing.
 * All business logic delegated to useFieldServiceMeetingForm hook.
 */
const FieldServiceMeetingForm: FC<FieldServiceMeetingFormProps> = ({
  meeting,
  mode,
  onClose,
  onSave,
  onDelete,
}) => {
  const { t } = useAppTranslation();
  const { tabletUp, laptopUp } = useBreakpoints();
  const [similarConfirmOpen, setSimilarConfirmOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

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
    if (!onDelete) return;
    await onDelete(meeting);
  };

  // Validate first (shows inline errors if invalid), then warn about
  // duplicates, then save.
  const handleDone = () => {
    if (!validate()) return;
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
    <Box
      role="form"
      aria-label={t(
        mode === 'add'
          ? 'tr_addFieldServiceMeeting'
          : 'tr_editFieldServiceMeeting'
      )}
      sx={{
        display: 'flex',
        gap: '16px',
        flexDirection: 'column',
        border: '1px solid var(--accent-300)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px',
        backgroundColor: 'var(--white)',
        // Disabled fields (e.g. a locked conductor) should read as muted in
        // both light and dark themes instead of MUI's hardcoded faded black.
        '& .MuiInputBase-input.Mui-disabled': {
          WebkitTextFillColor: 'var(--accent-350)',
        },
      }}
    >
      <Typography className="h3" color="var(--black)">
        {mode === 'add'
          ? t('tr_addFieldServiceMeeting')
          : t('tr_editFieldServiceMeeting')}
      </Typography>

      {/*
        Type / Group / Conductor.
        Desktop: three columns. Mobile: Type spans the full width, with
        Group + Conductor sharing the row below.
      */}
      <Box
        sx={{
          display: 'grid',
          gap: '16px',
          gridTemplateColumns: tabletUp ? '1fr 1fr 1fr' : '1fr 1fr',
        }}
      >
        <Autocomplete<FieldServiceMeetingCategory>
          sx={{ width: '100%', gridColumn: tabletUp ? 'auto' : '1 / -1' }}
          label={t('tr_type')}
          value={formData.meeting_data.category}
          options={categoryOptions}
          onChange={handleCategoryChange}
          getOptionLabel={(option) =>
            t(FIELD_SERVICE_MEETING_CATEGORY_TRANSLATION_KEYS[option])
          }
          isOptionEqualToValue={(option, value) => option === value}
          renderOption={(props, option) => (
            <Box component="li" {...props}>
              {t(FIELD_SERVICE_MEETING_CATEGORY_TRANSLATION_KEYS[option])}
            </Box>
          )}
        />
        <Autocomplete<GroupOption>
          sx={{ width: '100%' }}
          label={t('tr_group')}
          options={groupOptions}
          value={selectedGroup}
          onChange={handleGroupChange}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          getOptionLabel={(option) =>
            typeof option === 'string' ? option : option.label
          }
          disabled={isJointMeeting}
        />
        <Autocomplete<ConductorOption>
          sx={{ width: '100%' }}
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
          helperText={conductorError ? t('tr_fillRequiredField') : undefined}
        />
      </Box>

      <Divider color="var(--accent-200)" />
      <Typography className="h4" color="var(--grey-400)">
        {t('tr_details')}
      </Typography>

      {/*
        Details.
        Laptop+ (≥ 768 px): three equal columns —
          [Date + Start time (flex row)] | [Location] | [Address]
        Below 768 px: two-column grid, four separate cells —
          [Date]     [Start time]
          [Location] [Address]
        This avoids the Date + Time flex-box collapsing vertically when the
        first column of a 3-col grid is too narrow to hold both pickers.
      */}
      <Box
        sx={{
          display: 'grid',
          gap: '16px',
          gridTemplateColumns: laptopUp ? '1fr 1fr 1fr' : '1fr 1fr',
        }}
      >
        {laptopUp ? (
          /* ── laptop+: Date and Time share the first column ── */
          <Box sx={{ display: 'flex', gap: '16px' }}>
            <DatePicker
              sx={{ flex: 1, minWidth: 0, height: '48px' }}
              label={t('tr_date')}
              value={startDate}
              onChange={handleDateChange}
            />
            <TimePicker
              sx={{ flex: 1, height: '48px' }}
              label={t('tr_startTime')}
              ampm={false}
              value={startDate}
              onChange={handleTimeChange}
            />
          </Box>
        ) : (
          /* ── below 768 px: Date and Time as separate grid cells ── */
          <>
            <DatePicker
              sx={{ height: '48px' }}
              label={t('tr_date')}
              value={startDate}
              onChange={handleDateChange}
            />
            <TimePicker
              sx={{ height: '48px' }}
              label={t('tr_startTime')}
              ampm={false}
              value={startDate}
              onChange={handleTimeChange}
            />
          </>
        )}
        <Select
          sx={{ width: '100%', height: '48px' }}
          label={t('tr_location')}
          value={selectedLocation?.value ?? ''}
          onChange={(e) => {
            const nextValue = e.target.value;
            const found = locationOptions.find((opt) => opt.value === nextValue);
            handleLocationChange(e, found ?? null);
          }}
        >
          {locationOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Box display="flex" alignItems="center" gap="8px">
                {option.icon}
                <Typography className="body-regular">{option.label}</Typography>
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
          height={48}
          sx={{ width: '100%' }}
        />
      </Box>

      <TextField
        label={t('tr_additionalInfo')}
        value={formData.meeting_data.additionalInfo ?? ''}
        onChange={(event) =>
          updateMeetingData({ additionalInfo: event.target.value })
        }
        height={48}
        multiline
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        {/* Left: Delete (edit mode) or Cancel (add mode — blue, not red) */}
        {mode === 'edit' ? (
          <Button
            variant="secondary"
            color="red"
            startIcon={<IconDelete />}
            onClick={handleDeleteClick}
            disabled={saving}
          >
            {t('tr_delete')}
          </Button>
        ) : (
          <Button
            variant="secondary"
            startIcon={<IconClose />}
            onClick={onClose}
            disabled={saving}
          >
            {t('tr_cancel')}
          </Button>
        )}

        {/* Edit mode: always show Cancel alongside Done */}
        {mode === 'edit' && (
          <Button
            variant="secondary"
            startIcon={<IconClose />}
            onClick={onClose}
            disabled={saving}
          >
            {t('tr_cancel')}
          </Button>
        )}

        {/* Done is always clickable. Clicking with missing fields shows
            inline errors on the offending fields instead of a tooltip. */}
        <Button
          variant="secondary"
          startIcon={<IconCheck />}
          onClick={handleDone}
          disabled={saving}
        >
          {t('tr_done')}
        </Button>
      </Box>

      {similarConfirmOpen && (
        <Dialog
          open={similarConfirmOpen}
          onClose={() => setSimilarConfirmOpen(false)}
          sx={{ padding: '24px' }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Typography className="h3">
              {t('tr_similarMeetingFound')}
            </Typography>
            <Typography color="var(--grey-400)">
              {t('tr_similarMeetingFoundDesc')}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              width: '100%',
            }}
          >
            <Button variant="main" onClick={handleConfirmSimilar}>
              {t('tr_addAnyway')}
            </Button>
            <Button
              variant="secondary"
              onClick={() => setSimilarConfirmOpen(false)}
            >
              {t('tr_cancel')}
            </Button>
          </Box>
        </Dialog>
      )}

      {deleteConfirmOpen && (
        <Dialog
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
          sx={{ padding: '24px' }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Typography className="h3">
              {t('tr_deleteMeeting')}
            </Typography>
            <Typography color="var(--grey-400)">
              {t('tr_deleteMeetingDesc')}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              width: '100%',
            }}
          >
            <Button variant="secondary" color="red" onClick={handleConfirmDelete}>
              {t('tr_delete')}
            </Button>
            <Button
              variant="secondary"
              onClick={() => setDeleteConfirmOpen(false)}
            >
              {t('tr_cancel')}
            </Button>
          </Box>
        </Dialog>
      )}
    </Box>
  );
};

export default FieldServiceMeetingForm;
