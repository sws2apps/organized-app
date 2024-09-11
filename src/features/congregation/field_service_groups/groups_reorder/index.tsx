import { Stack } from '@mui/material';
import { ReactSortable } from 'react-sortablejs';
import { useAppTranslation } from '@hooks/index';
import { GroupsReorderProps } from './index.types';
import { GroupsContainer } from './index.styles';
import useGroupsReorder from './useGroupsReorder';
import Button from '@components/button';
import Dialog from '@components/dialog';
import GroupItem from './group_item';
import Typography from '@components/typography';

const GroupsReorder = (props: GroupsReorderProps) => {
  const { t } = useAppTranslation();

  const { groups, handleDragChange, handleSaveChanges } =
    useGroupsReorder(props);

  return (
    <Dialog onClose={props.onClose} open={props.open} sx={{ padding: '24px' }}>
      <Typography className="h2">{t('tr_reorderGroupsTitle')}</Typography>

      <GroupsContainer>
        <ReactSortable
          list={groups}
          setList={handleDragChange}
          handle=".scrollable-icon"
        >
          {groups.map((group) => (
            <GroupItem key={group.id} name={group.name} />
          ))}
        </ReactSortable>
      </GroupsContainer>

      <Stack spacing="8px" width="100%">
        <Button variant="main" onClick={handleSaveChanges}>
          {t('tr_save')}
        </Button>
        <Button variant="secondary" onClick={props.onClose}>
          {t('tr_cancel')}
        </Button>
      </Stack>
    </Dialog>
  );
};

export default GroupsReorder;
