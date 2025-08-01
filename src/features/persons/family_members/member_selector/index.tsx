import { Box } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { UsersOption } from './index.type';
import useFamilyMembers from '../useFamilyMembers';
import AutocompleteMultiple from '@components/autocomplete_multiple';
import MiniChip from '@components/mini_chip';
import Typography from '@components/typography';

const MemberSelector = () => {
  const { t } = useAppTranslation();

  const { onRemovePerson, handleAddFamilyMembers, familyMembers, options } =
    useFamilyMembers();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <AutocompleteMultiple
        label={t('tr_familyMembers')}
        fullWidth={true}
        options={options}
        getOptionLabel={(option: UsersOption) => option.person_name}
        isOptionEqualToValue={(option, value) =>
          option.person_uid === value.person_uid
        }
        value={options.filter((r) =>
          familyMembers.members.includes(r.person_uid)
        )}
        onChange={(_, value: UsersOption[]) =>
          handleAddFamilyMembers(value.map((v) => v.person_uid))
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
        renderValue={(value: UsersOption[]) =>
          value.map((option: UsersOption) => {
            return (
              <MiniChip
                key={option.person_uid}
                label={option.person_name}
                edit={true}
                onDelete={() => onRemovePerson(option.person_uid)}
              />
            );
          })
        }
      />
    </Box>
  );
};

export default MemberSelector;
