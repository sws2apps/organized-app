import { Box, Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { GroupMembersProps, PersonOption } from './index.types';
import useGroupMembers from './useGroupMembers';
import AutocompleteMultiple from '@components/autocomplete_multiple';
import Button from '@components/button';
import Typography from '@components/typography';
import MiniChip from '@components/mini_chip';

const GroupMembers = (props: GroupMembersProps) => {
  const { t } = useAppTranslation();

  const {
    adminOptions,
    admins,
    handleAdminChange,
    handleAdminDelete,
    memberOptions,
    handleMembersChange,
    handleMembersDelete,
    groupMembers,
  } = useGroupMembers(props);

  return (
    <Stack spacing="24px" width="100%">
      <Typography color="var(--grey-400)">
        {t('tr_addNewLangGroupMembersDesc')}
      </Typography>

      <AutocompleteMultiple
        label={t('tr_groupAdmins')}
        fullWidth={true}
        options={adminOptions}
        getOptionLabel={(option: PersonOption) => option?.person_name || '  '}
        isOptionEqualToValue={(option, value) =>
          option.person_uid === value.person_uid
        }
        value={admins}
        onChange={(_, value: PersonOption[]) => handleAdminChange(value)}
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
              onDelete={() => handleAdminDelete(option)}
            />
          ))
        }
      />

      <AutocompleteMultiple
        label={t('tr_groupMembers')}
        fullWidth={true}
        options={memberOptions}
        getOptionLabel={(option: PersonOption) => option?.person_name || '  '}
        isOptionEqualToValue={(option, value) =>
          option.person_uid === value.person_uid
        }
        value={groupMembers}
        onChange={(_, value: PersonOption[]) => handleMembersChange(value)}
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
              onDelete={() => handleMembersDelete(option)}
            />
          ))
        }
      />

      <Stack spacing="8px">
        <Button variant="main" onClick={props.onAction}>
          {t('tr_createGroup')}
        </Button>
        <Button variant="secondary" onClick={props.onClose}>
          {t('tr_cancel')}
        </Button>
      </Stack>
    </Stack>
  );
};

export default GroupMembers;
