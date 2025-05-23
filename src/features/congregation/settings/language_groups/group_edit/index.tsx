import { IconEdit } from '@components/icons';
import { GroupEditProps } from './index.types';
import useGroupEdit from './useGroupEdit';
import GroupInfo from '../group_info';
import IconButton from '@components/icon_button';

const GroupEdit = ({ group }: GroupEditProps) => {
  const { open, handleOpen, handleClose } = useGroupEdit();

  return (
    <>
      {open && <GroupInfo open={open} onClose={handleClose} group={group} />}

      <IconButton onClick={handleOpen} sx={{ padding: 0.2 }}>
        <IconEdit color="var(--accent-main)" />
      </IconButton>
    </>
  );
};

export default GroupEdit;
