import { CreateGroupProps } from './index.types';
import useCreateGroup from './useCreateGroup';
import Dialog from '@components/dialog';
import GroupDetails from './group_details';
import NewGroupMembers from './new_group_members';

const CreateGroup = (props: CreateGroupProps) => {
  const {
    handleCreate,
    handleNext,
    state,
    group,
    handleBack,
    handleGroupUpdate,
  } = useCreateGroup(props);

  return (
    <Dialog onClose={props.onClose} open={props.open}>
      {state === 'start' && (
        <GroupDetails
          action={handleNext}
          onClose={props.onClose}
          group={group}
          onChange={handleGroupUpdate}
        />
      )}

      {state === 'final' && (
        <NewGroupMembers
          action={handleCreate}
          onBack={handleBack}
          group={group}
          onChange={handleGroupUpdate}
        />
      )}
    </Dialog>
  );
};

export default CreateGroup;
