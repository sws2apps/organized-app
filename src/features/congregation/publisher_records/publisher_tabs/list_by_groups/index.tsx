import { Stack } from '@mui/material';
import { ListByGroupsProps } from './index.types';
import useListByGroups from './useListByGroups';
import Accordion from '@components/accordion';
import Divider from '@components/divider';
import PersonItem from '../person_item';

const ListByGroups = (props: ListByGroupsProps) => {
  const { groups, month, expanded, handleExpandedChange, type } =
    useListByGroups(props);

  return (
    <Stack
      divider={<Divider color="var(--accent-200)" />}
      margin="0px 0px -24px 0px"
    >
      {groups.map((group) => (
        <Accordion
          key={group.group_id}
          id={group.group_id}
          label={group.group_name}
          expanded={expanded === group.group_id}
          onChange={handleExpandedChange}
        >
          <Stack spacing="8px" marginBottom="16px">
            {group.group_members.map((person) => (
              <PersonItem
                key={person.person_uid}
                person={person}
                month={month}
                type={type}
              />
            ))}
          </Stack>
        </Accordion>
      ))}
    </Stack>
  );
};

export default ListByGroups;
