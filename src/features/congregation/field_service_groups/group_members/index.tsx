import { Box, Stack } from '@mui/material';
import { ReactSortable } from 'react-sortablejs';
import { useAppTranslation } from '@hooks/index';
import { GroupMembersProps, UsersOption } from './index.types';
import useGroupMembers from './useGroupMembers';
import Autocomplete from '@components/autocomplete';
import MemberItem from './member_item';
import Typography from '@components/typography';

const GroupMembers = (props: GroupMembersProps) => {
  const { t } = useAppTranslation();

  const {
    publishers_unassigned,
    handleAddPublisher,
    members,
    handleDragChange,
    handleRemove,
    handleInputChange,
    inputValue,
  } = useGroupMembers(props);

  return (
    <Stack spacing="8px" width="100%">
      <Box sx={{ maxHeight: '300px', overflow: 'auto' }}>
        {members.length > 0 && (
          <ReactSortable
            list={members}
            setList={handleDragChange}
            handle=".scrollable-icon"
          >
            {members.map((member) => (
              <MemberItem
                key={member.id}
                member={member.id}
                onDelete={handleRemove}
              />
            ))}
          </ReactSortable>
        )}
      </Box>

      <Autocomplete
        variant="standard"
        label={t('tr_addPublishers')}
        options={publishers_unassigned}
        getOptionLabel={(option: UsersOption) => option.person_name}
        isOptionEqualToValue={(option, value) =>
          option.person_uid === value?.person_uid
        }
        value={null}
        inputValue={inputValue}
        onInputChange={(_, value) => handleInputChange(value)}
        onChange={(e, value: UsersOption) => handleAddPublisher(value)}
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
    </Stack>
  );
};

export default GroupMembers;
