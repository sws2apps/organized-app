import { ReactSortable } from 'react-sortablejs';
import { useAppTranslation } from '@hooks/index';
import { GroupsReorderProps } from './index.types';
import { GroupsContainer } from './index.styles';
import useGroupsReorder from './useGroupsReorder';
import Button from '@components/button';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
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

      <DialogActions>
        <Button variant="secondary" onClick={props.onClose}>
          {t('tr_cancel')}
        </Button>
        <Button variant="main" onClick={handleSaveChanges}>
          {t('tr_save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GroupsReorder;
