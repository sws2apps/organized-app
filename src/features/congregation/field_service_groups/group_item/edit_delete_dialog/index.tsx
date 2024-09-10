import { EditDeleteDialogProps } from './index.types';
import Dialog from '@components/dialog';
import GroupEdit from '../../group_edit';
import GroupDelete from '../../group_delete';

const EditDeleteDialog = ({
  group,
  index,
  onClose,
  onDelete,
  open,
  type,
}: EditDeleteDialogProps) => {
  return (
    <Dialog onClose={onClose} open={open} sx={{ padding: '24px' }}>
      {type === 'edit' && (
        <GroupEdit
          group={group}
          index={index}
          onClose={onClose}
          onDelete={onDelete}
        />
      )}
      {type === 'delete' && (
        <GroupDelete
          group_id={group.group_id}
          index={index}
          onClose={onClose}
        />
      )}
    </Dialog>
  );
};

export default EditDeleteDialog;
