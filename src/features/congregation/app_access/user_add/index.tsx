import { UserAddType } from './index.types';
import useUserAdd from './useUserAdd';
import Dialog from '@components/dialog';
import PersonSelect from './person_select';
import InvitationCode from './invitation_code';

const UserAdd = ({ open, onClose }: UserAddType) => {
  const { currentStep, user, handleMoveStep, handleSetUser } = useUserAdd();

  return (
    <Dialog onClose={onClose} open={open} sx={{ padding: '24px' }}>
      {currentStep === 'select' && (
        <PersonSelect
          onClose={onClose}
          onSetUser={handleSetUser}
          onSetStep={handleMoveStep}
        />
      )}

      {currentStep === 'share' && (
        <InvitationCode onClose={onClose} user={user} />
      )}
    </Dialog>
  );
};

export default UserAdd;
