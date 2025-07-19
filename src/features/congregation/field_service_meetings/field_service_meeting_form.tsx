import { useState, type FC, type JSX } from 'react';
import { Box } from '@mui/material';
import {
  IconAtHome,
  IconCheck,
  IconClose,
  IconConference,
  IconCongregation,
  IconInTerritory,
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

const locations = [
  { label: 'Publisher', icon: <IconAtHome /> },
  { label: 'Kingdom Hall', icon: <IconCongregation /> },
  { label: 'Territory', icon: <IconInTerritory /> },
  { label: 'Zoom', icon: <IconConference /> },
] as const;

const meetingTypeList = [
  'Field service group meeting',
  'Joint meeting',
  'Service overseer visit',
] as const;

type MeetingType = (typeof meetingTypeList)[number];
type LocationType = (typeof locations)[number];

type FieldServiceMeetingFormProps = {
  handleCloseForm: () => void;
};

const FieldServiceMeetingForm: FC<FieldServiceMeetingFormProps> = ({
  handleCloseForm,
}) => {
  const { t } = useAppTranslation();
  const [location, setLocation] = useState<LocationType['label']>(
    locations[0].label
  );
  const [meetingType, setMeetingType] = useState<MeetingType>(
    meetingTypeList[0]
  );

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
        {t('tr_addFieldServiceMeeting')}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <Autocomplete
          label={t('tr_type')}
          options={meetingTypeList}
          value={meetingType}
          onChange={(_, value: MeetingType) => {
            setMeetingType(value);
          }}
        />
        <Autocomplete
          label={t('tr_group')}
          options={['Group 10 - Group name']}
          value={meetingType === 'Joint meeting' ? '' : 'Group 10 - Group name'}
          disabled={meetingType === 'Joint meeting'}
        />
        <Autocomplete
          label={t('tr_conductor')}
          value="Nolan Ekstrom Bothman"
          options={['Nolan Ekstrom Bothman']}
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
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          gap="16px"
          justifyContent="space-between"
          flex={1}
        >
          <DatePicker
            sx={{ flex: 1, height: '48px' }}
            label="Date"
            value={new Date()}
          />
          <TimePicker
            sx={{ flex: 1, height: '48px' }}
            label="Time"
            ampm={false}
            value={new Date('2023-11-19T12:00:00')}
          />
        </Box>
        <Autocomplete
          sx={{ flex: 1 }}
          autoHighlight
          label={t('tr_location')}
          isOptionEqualToValue={(option, value) => option.label === value.label}
          getOptionLabel={(option: { label: string; icon: JSX.Element }) =>
            option.label
          }
          value={locations.find((option) => option.label === location)}
          onChange={(_, value: LocationType) => {
            console.log(value);
            setLocation(value.label);
          }}
          renderValue={(option: LocationType) => (
            <>
              {option.icon} {option.label}
            </>
          )}
          options={locations}
          renderOption={(props, option) => {
            return (
              <Box
                key={option.label}
                component="li"
                {...props}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                {option.icon} {option.label}
              </Box>
            );
          }}
        />
        <Autocomplete
          label={location !== 'Zoom' ? t('tr_address') : t('tr_joinInfo')}
          options={['Family Mayers, New World Street 28, New York']}
          value="Family Mayers, New World Street 28, New York"
          sx={{ flex: 1 }}
        />
      </Box>
      <TextField label={t('tr_additionalInfo')} height={48} />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'right',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <Button
          variant="secondary"
          startIcon={<IconClose />}
          color="red"
          onClick={handleCloseForm}
        >
          {t('tr_cancel')}
        </Button>
        <Button
          variant="secondary"
          startIcon={<IconCheck />}
          onClick={handleCloseForm}
        >
          {t('tr_done')}
        </Button>
      </Box>
    </Box>
  );
};

export default FieldServiceMeetingForm;
