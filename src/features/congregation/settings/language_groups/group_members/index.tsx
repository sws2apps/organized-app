import { Box, Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { LanguageGroupMembersProps, PersonOption } from './index.types';
import useLanguageGroupMembers from './useGroupMembers';
import AutocompleteMultiple from '@components/autocomplete_multiple';
import MiniChip from '@components/mini_chip';
import Typography from '@components/typography';

const LanguageGroupMembers = (props: LanguageGroupMembersProps) => {
  const { t } = useAppTranslation();

  const {
    overseersOptions,
    overseersSelected,
    memberOptions,
    membersSelected,
    handleMembersChange,
    handleMembersDelete,
    handleOverseerDelete,
    handleOverseersChange,
  } = useLanguageGroupMembers(props);

  return (
    <Stack spacing="16px" width="100%">
      <AutocompleteMultiple
        filterSelectedOptions
        readOnly={props.readOnly}
        label={t('tr_languageGroupOverseers')}
        fullWidth={true}
        options={overseersOptions}
        getOptionLabel={(option: PersonOption) => option?.person_name || '  '}
        getOptionDisabled={() => overseersSelected.length > 1}
        isOptionEqualToValue={(option, value) =>
          option.person_uid === value.person_uid
        }
        value={overseersSelected}
        onChange={(_, value: PersonOption[]) =>
          handleOverseersChange(value.map((record) => record.person_uid))
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
        renderValue={(value: PersonOption[]) =>
          value.map((option: PersonOption, index) => {
            return (
              <MiniChip
                key={option?.person_uid ?? `missing-key-${index}`}
                label={option?.person_name ?? ''}
                edit={true}
                onDelete={() => handleOverseerDelete(option.person_uid)}
              />
            );
          })
        }
      />

      <AutocompleteMultiple
        filterSelectedOptions
        readOnly={props.readOnly}
        label={`${t('tr_groupMembers')} (${membersSelected.length})`}
        fullWidth={true}
        options={memberOptions}
        getOptionLabel={(option: PersonOption) => option?.person_name || '  '}
        isOptionEqualToValue={(option, value) =>
          option.person_uid === value.person_uid
        }
        value={membersSelected}
        onChange={(_, value: PersonOption[]) =>
          handleMembersChange(value.map((record) => record.person_uid))
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
        renderValue={(value: PersonOption[]) =>
          value.map((option: PersonOption) => {
            return (
              <MiniChip
                key={option.person_uid}
                label={option.person_name}
                edit={true}
                onDelete={() => handleMembersDelete(option.person_uid)}
              />
            );
          })
        }
      />
    </Stack>
  );
};

export default LanguageGroupMembers;
