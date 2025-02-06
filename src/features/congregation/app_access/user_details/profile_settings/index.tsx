import { Box } from '@mui/material';
import IconLoading from '@components/icon_loading';
import { DetailsContainer } from '../shared_styles';
import { UsersOption } from './index.types';
import { useAppTranslation } from '@hooks/index';
import useProfileSettings from './useProfileSettings';
import useUserDetails from '../useUserDetails';
import Autocomplete from '@components/autocomplete';
import AutocompleteMultiple from '@components/autocomplete_multiple';
import Divider from '@components/divider';
import MiniChip from '@components/mini_chip';
import Typography from '@components/typography';

const ProfileSettings = () => {
  const { t } = useAppTranslation();

  const { isProcessing } = useUserDetails();

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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Typography className="h2" color={'var(--black)'}>
            {t('tr_profileSettings')}
          </Typography>
          {isProcessing && <IconLoading color="var(--black)" />}
        </Box>

        <Autocomplete
          readOnly={isProcessing}
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
          readOnly={isProcessing}
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
