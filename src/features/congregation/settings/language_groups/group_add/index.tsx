import { GroupAddProps } from './index.types';
import useGroupAdd from './useGroupAdd';
import Dialog from '@components/dialog';
import GroupDetails from './group_details';

const GroupAdd = (props: GroupAddProps) => {
  const { step, group, handleGroupChange } = useGroupAdd();

  return (
    <Dialog onClose={props.onClose} open={props.open}>
      {step === 'start' && (
        <GroupDetails
          onClose={props.onClose}
          group={group}
          onChange={handleGroupChange}
        />
      )}
    </Dialog>
  );
};

export default GroupAdd;
