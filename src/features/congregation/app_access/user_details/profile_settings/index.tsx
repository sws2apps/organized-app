import { Box } from '@mui/material';
import { DetailsContainer } from '../shared_styles';
import { UsersOption } from './index.types';
import { useAppTranslation } from '@hooks/index';
import useProfileSettings from './useProfileSettings';
import Autocomplete from '@components/autocomplete';
import Divider from '@components/divider';
import Typography from '@components/typography';
import AutocompleteMultiple from '@components/autocomplete_multiple';
import MiniChip from '@components/mini_chip';

const ProfileSettings = () => {
  const { t } = useAppTranslation();

  const {
    persons,
    handleSelectPerson,
    selectedPerson,
    delegatedPersons,
    handleDelegatedPersonsChange,
    handleDeletePerson,
    delegateOptions,
  } = useProfileSettings();

  return (
    <DetailsContainer>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <Typography className="h2" color={'var(--black)'}>
          {t('tr_profileSettings')}
        </Typography>

        <Autocomplete
          disableClearable
          label={t('tr_bindWithRecord')}
          options={persons}
          getOptionLabel={(option: UsersOption) => option.person_name}
          isOptionEqualToValue={(option, value) =>
            option.person_uid === value.person_uid
          }
          value={selectedPerson}
          onChange={(_, value: UsersOption) => handleSelectPerson(value)}
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

        <Divider color="var(--accent-200)" />

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <Typography className="h2">{t('tr_delegatePersons')}</Typography>
          <Typography color="var(--grey-400)">
            {t('tr_delegatePersonsDesc')}
          </Typography>
        </Box>

        <AutocompleteMultiple
          label={t('tr_delegatePersons')}
          fullWidth={true}
          options={delegateOptions}
          getOptionLabel={(option: UsersOption) => option.person_name}
          isOptionEqualToValue={(option, value) =>
            option.person_uid === value.person_uid
          }
          value={delegatedPersons}
          onChange={(_, value: UsersOption[]) =>
            handleDelegatedPersonsChange(value)
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
          height={40}
          renderTags={(tagValue) =>
            tagValue.map((option) => (
              <MiniChip
                key={option.person_uid}
                label={option.person_name}
                edit={true}
                onDelete={() => handleDeletePerson(option)}
              />
            ))
          }
        />
      </Box>
    </DetailsContainer>
  );
};

export default ProfileSettings;
