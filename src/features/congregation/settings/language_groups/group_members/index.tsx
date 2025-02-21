import { Box, Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { LanguageGroupMembersProps, PersonOption } from './index.types';
import useLanguageGroupMembers from './useGroupMembers';
import AutocompleteMultiple from '@components/autocomplete_multiple';
import Typography from '@components/typography';
import MiniChip from '@components/mini_chip';
import Tooltip from '@components/tooltip';

const LanguageGroupMembers = (props: LanguageGroupMembersProps) => {
  const { t } = useAppTranslation();

  const {
    adminOptions,
    adminsSelected,
    memberOptions,
    membersSelected,
    isConnected,
  } = useLanguageGroupMembers(props);

  return (
    <Stack spacing="16px" width="100%">
      <Tooltip title={t('tr_offlineLocked')} show={!isConnected}>
        <AutocompleteMultiple
          disabled={!isConnected}
          readOnly={props.readOnly}
          label={t('tr_groupAdmins')}
          fullWidth={true}
          options={adminOptions}
          getOptionLabel={(option: PersonOption) => option?.person_name || '  '}
          isOptionEqualToValue={(option, value) =>
            option.person_uid === value.person_uid
          }
          value={adminsSelected}
          onChange={(_, value: PersonOption[]) =>
            props.onAdminsChange(value.map((record) => record.person_uid))
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
                disabled={!isConnected}
                onDelete={() => props.onAdminDelete(option.person_uid)}
              />
            ))
          }
        />
      </Tooltip>

      <AutocompleteMultiple
        readOnly={props.readOnly}
        label={t('tr_groupMembers')}
        fullWidth={true}
        options={memberOptions}
        getOptionLabel={(option: PersonOption) => option?.person_name || '  '}
        isOptionEqualToValue={(option, value) =>
          option.person_uid === value.person_uid
        }
        value={membersSelected}
        onChange={(_, value: PersonOption[]) =>
          props.onMembersChange(value.map((record) => record.person_uid))
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
              onDelete={() => props.onMemberDelete(option.person_uid)}
            />
          ))
        }
      />
    </Stack>
  );
};

export default LanguageGroupMembers;
