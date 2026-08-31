import { Box, FormControlLabel, RadioGroup } from '@mui/material';
import { FullnameOption } from '@definition/settings';
import { SpeakerInfoTabType } from './index.types';
import { buildPersonFullname } from '@utils/common';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import MenuItem from '@components/menuitem';
import Radio from '@components/radio';
import Select from '@components/select';
import TextField from '@components/textfield';
import Typography from '@components/typography';

const SpeakerInfoTab = ({
  draft,
  local,
  displayNameEnabled,
  fullnameOption,
  persons,
  onFirstnameChange,
  onLastnameChange,
  onDisplayNameChange,
  onPrivilegeChange,
  onEmailChange,
  onPhoneChange,
  onNoteChange,
  onPersonChange,
}: SpeakerInfoTabType) => {
  const { t } = useAppTranslation();

  const { tabletDown } = useBreakpoints();

  if (local) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Select
          label={t('tr_speaker')}
          value={draft.person_uid}
          onChange={(e) => onPersonChange(e.target.value as string)}
        >
          {persons.map((person) => (
            <MenuItem key={person.person_uid} value={person.person_uid}>
              <Typography>
                {buildPersonFullname(
                  person.person_data.person_lastname.value,
                  person.person_data.person_firstname.value,
                  fullnameOption
                )}
              </Typography>
            </MenuItem>
          ))}
        </Select>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: tabletDown
            ? fullnameOption === FullnameOption.FIRST_BEFORE_LAST
              ? 'column'
              : 'column-reverse'
            : fullnameOption === FullnameOption.FIRST_BEFORE_LAST
              ? 'row'
              : 'row-reverse',
        }}
      >
        <TextField
          label={t('tr_firstname')}
          value={draft.firstname}
          onChange={(e) => onFirstnameChange(e.target.value)}
        />
        <TextField
          label={t('tr_lastname')}
          value={draft.lastname}
          onChange={(e) => onLastnameChange(e.target.value)}
        />
      </Box>

      {displayNameEnabled && (
        <TextField
          label={t('tr_displayName')}
          value={draft.displayName}
          onChange={(e) => onDisplayNameChange(e.target.value)}
        />
      )}

      <RadioGroup
        sx={{
          marginLeft: '4px',
          flexDirection: 'row',
          gap: tabletDown ? '16px' : '24px',
          flexWrap: 'wrap',
        }}
        value={draft.privilege}
        onChange={(e) => onPrivilegeChange(e.target.value)}
      >
        <FormControlLabel
          value="elder"
          control={<Radio />}
          label={<Typography>{t('tr_elder')}</Typography>}
        />
        <FormControlLabel
          value="ms"
          control={<Radio />}
          label={<Typography>{t('tr_ministerialServant')}</Typography>}
        />
      </RadioGroup>

      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: tabletDown ? 'column' : 'row',
        }}
      >
        <TextField
          label={t('tr_email')}
          value={draft.email}
          onChange={(e) => onEmailChange(e.target.value)}
        />
        <TextField
          label={t('tr_phoneNumber')}
          value={draft.phone}
          onChange={(e) => onPhoneChange(e.target.value)}
        />
      </Box>

      <TextField
        label={t('tr_shortNote')}
        value={draft.note}
        onChange={(e) => onNoteChange(e.target.value)}
      />
    </Box>
  );
};

export default SpeakerInfoTab;
