import { Box, Stack } from '@mui/material';
import { useAtomValue } from 'jotai';
import { IconDelete } from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { CircuitOverseerEventCategory } from '@definition/circuit_overseer_visit';
import { CIRCUIT_OVERSEER_EVENT_LABELS } from '@constants/circuit_overseer_visit';
import { hour24FormatState } from '@states/settings';
import { EventEditorProps, HostOption } from './index.types';
import useEventEditor from './useEventEditor';
import AutocompleteMultiple from '@components/autocomplete_multiple';
import Button from '@components/button';
import Checkbox from '@components/checkbox';
import MenuItem from '@components/menuitem';
import MeetingFields from '../meeting_fields';
import Select from '@components/select';
import TextField from '@components/textfield';
import TimePicker from '@components/time_picker';
import Typography from '@components/typography';

const EventEditor = (props: EventEditorProps) => {
  const { t } = useAppTranslation();

  const { laptopUp } = useBreakpoints();

  const hour24 = useAtomValue(hour24FormatState);

  const {
    data,
    time,
    hostOptions,
    hostsSelected,
    handleChange,
    handleTimeChange,
    handleCategoryChange,
    handleDelete,
  } = useEventEditor(props);

  return (
    <Stack spacing="16px">
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: laptopUp
            ? 'minmax(0, 1fr) minmax(0, 2fr) auto'
            : 'minmax(0, 1fr) auto',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <TimePicker
          ampm={!hour24}
          label={t('tr_COTime')}
          value={time}
          onChange={handleTimeChange}
        />

        <Box
          sx={{
            gridRow: laptopUp ? 'auto' : 2,
            gridColumn: laptopUp ? 'auto' : '1 / -1',
          }}
        >
          <Select
            label={t('tr_COActivity')}
            value={data.category}
            onChange={(e) =>
              handleCategoryChange(
                e.target.value as CircuitOverseerEventCategory
              )
            }
          >
            {Object.entries(CIRCUIT_OVERSEER_EVENT_LABELS).map(
              ([category, label]) => (
                <MenuItem key={category} value={category}>
                  <Typography>{t(label)}</Typography>
                </MenuItem>
              )
            )}
          </Select>
        </Box>

        <Button
          variant="small"
          color="red"
          startIcon={<IconDelete />}
          disableAutoStretch
          onClick={handleDelete}
        >
          {t('tr_delete')}
        </Button>
      </Box>

      {data.category === 'hospitality' && (
        <AutocompleteMultiple
          filterSelectedOptions
          fullWidth
          label={t('tr_COHosts')}
          options={hostOptions}
          value={hostsSelected}
          getOptionLabel={(option: HostOption) => option.person_name}
          isOptionEqualToValue={(option, value) =>
            option.person_uid === value.person_uid
          }
          onChange={(_, value: HostOption[]) =>
            handleChange({ hosts: value.map((record) => record.person_uid) })
          }
          renderOption={(props, option) => (
            <Box
              component="li"
              {...props}
              sx={{ margin: 0, padding: 0 }}
              key={option.person_uid}
            >
              <Typography>{option.person_name}</Typography>
            </Box>
          )}
        />
      )}

      <TextField
        label={t('tr_address')}
        value={data.address}
        onChange={(e) => handleChange({ address: e.target.value }, true)}
      />

      {(data.category === 'midweek' || data.category === 'weekend') && (
        <MeetingFields meeting={data.category} weekOf={props.weekOf} isEdit />
      )}

      <TextField
        label={`${t('tr_shortNote')} (${t('tr_optional')})`}
        value={data.notes}
        onChange={(e) => handleChange({ notes: e.target.value }, true)}
        multiline
        minRows={2}
      />

      <Checkbox
        label={t('tr_COEldersOnly')}
        labelDescription={t('tr_COEldersOnlyDesc')}
        checked={data.elders_only}
        onChange={(_, checked) => handleChange({ elders_only: checked })}
      />
    </Stack>
  );
};

export default EventEditor;
