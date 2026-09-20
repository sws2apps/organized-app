import { Box } from '@mui/material';
import { ReactSortable } from 'react-sortablejs';
import { GroupItemProps } from './index.types';
import { GroupContainer } from './index.styles';
import { MEMBERS_SORTABLE_GROUP } from '../constants';
import useGroupItem from './useGroupItem';
import GroupHeader from './header';
import GroupMember from './member';

const GroupItem = (props: GroupItemProps) => {
  const {
    border_color,
    divider_color,
    members,
    accepts_members,
    handleMembersChange,
  } = useGroupItem(props);

  return (
    <GroupContainer sx={{ border: border_color }}>
      <GroupHeader
        group={props.group}
        index={props.index}
        editable={props.editable}
      />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          minHeight: '8px',
          '& > * + *': {
            paddingTop: '4px',
            borderTop: `1px solid ${divider_color}`,
          },
        }}
      >
        <ReactSortable
          list={members}
          setList={handleMembersChange}
          group={{
            name: MEMBERS_SORTABLE_GROUP,
            pull: false,
            put: accepts_members,
          }}
          sort={false}
          animation={150}
          style={{ display: 'contents' }}
        >
          {members.map((member) => (
            <GroupMember
              key={member.person_uid}
              index={props.index}
              member={member}
              group_id={props.group.group_id}
              editable={props.editable}
            />
          ))}
        </ReactSortable>
      </Box>
    </GroupContainer>
  );
};

export default GroupItem;
