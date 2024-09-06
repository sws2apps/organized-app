import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { ListByGroupsProps } from './index.types';
import useListByGroups from './useListByGroups';
import Accordion from '@components/accordion';
import Divider from '@components/divider';
import PersonItem from '../person_item';
import Typography from '@components/typography';

const ListByGroups = (props: ListByGroupsProps) => {
  const { t } = useAppTranslation();

  const { groups, month, count, expanded, handleExpandedChange } =
    useListByGroups(props);

  return (
    <Stack spacing="16px" margin="0px 0px -24px 0px">
      <Typography className="h3">
        {t('tr_personsAmount', { amount: count })}
      </Typography>

      <Stack divider={<Divider color="var(--accent-200)" />}>
        {groups.map((group) => (
          <Accordion
            key={group.group_id}
            id={group.group_id}
            label={group.group_name}
            expanded={expanded === group.group_id}
            onChange={handleExpandedChange}
          >
            <Stack spacing="8px">
              {group.group_members.map((person) => (
                <PersonItem
                  key={person.person_uid}
                  person={person}
                  month={month}
                />
              ))}
            </Stack>
          </Accordion>
        ))}
      </Stack>
    </Stack>
  );
};

export default ListByGroups;
