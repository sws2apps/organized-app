import { Fragment } from 'react';
import { Box, Collapse, Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { ActivePublishersProps } from './index.types';
import useActivePublishers from './useActivePublishers';
import Accordion from '@components/accordion';
import Button from '@components/button';
import Divider from '@components/divider';
import PersonItem from '../person_item';
import SearchBar from '@components/search_bar';
import Checkbox from '@components/checkbox';
import { IconCollapse } from '@components/icons';
import IconButton from '@components/icon_button';

const ActivePublishers = ({ onClose }: ActivePublishersProps) => {
  const { t } = useAppTranslation();

  const {
    groups,
    expanded,
    handleExpandedChange,
    handleCheckedChange,
    selected,
  } = useActivePublishers();

  return (
    <Stack spacing="24px" marginBottom="-24px">
      <Stack spacing="16px">
        <SearchBar placeholder={t('tr_searchByName')} />

        <Stack
          // maxHeight="290px"
          // overflow="auto"
          divider={<Divider color="var(--accent-200)" />}
          sx={{ overflowX: 'hidden' }}
        >
          {groups.map((group) => (
            <Fragment key={group.group_id}>
              <Box
                onClick={() =>
                  handleExpandedChange(
                    expanded === group.group_id ? false : group.group_id
                  )
                }
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                }}
              >
                <Checkbox
                  stopPropagation
                  checked={selected[group.group_id].all as boolean}
                  onChange={(e) =>
                    handleCheckedChange(group.group_id, e.target.checked)
                  }
                  className="h4"
                  label={group.group_name}
                  sx={{ marginLeft: '4px' }}
                />

                <IconCollapse
                  color="var(--accent-dark)"
                  sx={{
                    transform:
                      expanded === group.group_id
                        ? 'rotate(0deg)'
                        : 'rotate(180deg)',
                    transition: 'transform 0.3s',
                  }}
                />
              </Box>
              <Collapse
                in={expanded === group.group_id}
                unmountOnExit={false}
                mountOnEnter
              >
                <Stack paddingLeft="24px">
                  {group.group_members.map((person) => (
                    <PersonItem key={person.person_uid} person={person} />
                  ))}
                </Stack>
              </Collapse>
              {/* <Accordion
              
              id={group.group_id}
              label={
                <Checkbox
                  stopPropagation
                  checked={selected[group.group_id].all as boolean}
                  onChange={(e) =>
                    handleCheckedChange(group.group_id, e.target.checked)
                  }
                  className="h4"
                  label={group.group_name}
                  sx={{ marginLeft: '4px' }}
                />
              }
              expanded={expanded === group.group_id}
              onChange={handleExpandedChange}
              // sx={{ overflowX: 'hidden' }}
              detailsProps={{ sx: { paddingTop: 'unset' } }}
            >
              <Stack marginLeft="8px">
                {group.group_members.map((person) => (
                  <PersonItem key={person.person_uid} person={person} />
                ))}
              </Stack>
            </Accordion> */}
            </Fragment>
          ))}
        </Stack>
      </Stack>

      <Stack spacing="8px" width="100%">
        <Button variant="main">{t('tr_export')}</Button>
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>
      </Stack>
    </Stack>
  );
};

export default ActivePublishers;
