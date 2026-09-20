import { Stack } from '@mui/material';
import { GroupItemProps } from './index.types';
import { GroupContainer } from './index.styles';
import useGroupItem from './useGroupItem';
import Divider from '@components/divider';
import GroupHeader from './header';
import GroupMember from './member';

const GroupItem = (props: GroupItemProps) => {
  const { border_color, divider_color, members } = useGroupItem(props);

  return (
    <GroupContainer sx={{ border: border_color }}>
      <GroupHeader
        group={props.group}
        index={props.index}
        editable={props.editable}
      />

      <Stack spacing="4px" divider={<Divider color={divider_color} />}>
        {members.map((member) => (
          <GroupMember
            key={member.person_uid}
            index={props.index}
            member={member}
            group_id={props.group.group_id}
            editable={props.editable}
          />
        ))}
      </Stack>
    </GroupContainer>
  );
};

export default GroupItem;
