import { type FC } from 'react';
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
import DatePicker from '@components/date_picker';
import TimePicker from '@components/time_picker';
import Divider from '@components/divider';
import TextField from '@components/textfield';
import { useAppTranslation } from '@hooks/index';
import {
  FieldServiceMeetingCategory,
  FieldServiceMeetingType,
  FIELD_SERVICE_MEETING_CATEGORIES,
  FIELD_SERVICE_MEETING_CATEGORY_TRANSLATION_KEYS,
} from '@definition/field_service_meetings';
import type { GroupOption, LocationOption } from '../index.types';
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
    locationFieldLabel,
    canSubmit,
    updateMeetingData,
    handleDateChange,
    handleTimeChange,
    handleGroupChange,
    handleLocationChange,
    handleCategoryChange,
    handleSave,
  } = useMeetingForm(meeting, onSave);

  const handleDelete = async () => {
    if (!onDelete) return;
    await onDelete(meeting);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '16px',
        flexDirection: 'column',
        border: '1px solid var(--accent-300)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px',
        backgroundColor: 'var(--white)',
      }}
    >
      <Typography className="h3" color="var(--black)">
        {mode === 'add'
          ? t('tr_addFieldServiceMeeting')
          : t('tr_editFieldServiceMeeting')}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        <Autocomplete<FieldServiceMeetingCategory>
          sx={{ flex: 1, minWidth: '220px' }}
          label={t('tr_type')}
          value={formData.meeting_data.category}
          options={FIELD_SERVICE_MEETING_CATEGORIES}
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
          sx={{ flex: 1, minWidth: '220px' }}
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
        <Autocomplete<string>
          sx={{ flex: 1, minWidth: '220px' }}
          label={t('tr_conductor')}
          options={conductorOptions}
          value={formData.meeting_data.conductor}
          freeSolo={selectedGroup.id === 'main'}
          onChange={(_, value) => {
            const nextValue = Array.isArray(value)
              ? (value.at(0) ?? '')
              : (value ?? '');
            if (
              selectedGroup.id !== 'main' &&
              nextValue &&
              !conductorOptions.includes(nextValue)
            ) {
              return; // ignore invalid selection when restricted
            }
            updateMeetingData({ conductor: nextValue });
          }}
          onInputChange={(_, value) => {
            if (selectedGroup.id !== 'main') return; // disallow arbitrary typing when restricted
            updateMeetingData({ conductor: value ?? '' });
          }}
          isOptionEqualToValue={(option, value) => option === value}
          getOptionLabel={(option) => option}
          endIcon={<IconSearch />}
        />
      </Box>
      <Divider color="var(--accent-200)" />
      <Typography className="h4" color="var(--grey-400)">
        {t('tr_details')}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          gap="16px"
          justifyContent="space-between"
          flex={1}
          minWidth="260px"
        >
          <DatePicker
            sx={{ flex: 1, height: '48px' }}
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
        <Autocomplete<LocationOption>
          sx={{ flex: 1, minWidth: '220px' }}
          autoHighlight
          label={t('tr_location')}
          options={locationOptions}
          value={selectedLocation}
          onChange={handleLocationChange}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          getOptionLabel={(option) =>
            typeof option === 'string' ? option : option.label
          }
          renderOption={(props, option) => {
            const normalized =
              typeof option === 'string'
                ? (locationOptions.find((item) => item.label === option) ??
                  selectedLocation)
                : option;

            return (
              <Box
                component="li"
                {...props}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                {normalized.icon} {normalized.label}
              </Box>
            );
          }}
          renderValue={(option: LocationOption | string) => {
            const normalized =
              typeof option === 'string'
                ? (locationOptions.find((item) => item.label === option) ??
                  selectedLocation)
                : option;

            return (
              <Box display="flex" alignItems="center" gap="8px">
                {normalized.icon} {normalized.label}
              </Box>
            );
          }}
        />
        <TextField
          label={locationFieldLabel}
          value={formData.meeting_data.address ?? ''}
          onChange={(event) =>
            updateMeetingData({ address: event.target.value })
          }
          sx={{ flex: 1, minWidth: '220px' }}
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
        minRows={2}
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
        <Button
          variant="secondary"
          startIcon={mode === 'edit' ? <IconDelete /> : <IconClose />}
          color="red"
          onClick={mode === 'edit' ? handleDelete : onClose}
          disabled={saving}
        >
          {mode === 'edit' ? t('tr_delete') : t('tr_cancel')}
        </Button>
        <Button
          variant="secondary"
          startIcon={<IconCheck />}
          onClick={handleSave}
          disabled={!canSubmit || saving}
        >
          {t('tr_done')}
        </Button>
      </Box>
    </Box>
  );
};

export default FieldServiceMeetingForm;
