import { useAppTranslation } from '@hooks/index';
import { AssignmentsHistoryDialogType } from './index.types';
import AssignmentsHistory from '../assignments_history';
import Dialog from '@components/dialog';

const AssignmentsHistoryDialog = ({
  open,
  onClose,
  person,
  history,
}: AssignmentsHistoryDialogType) => {
  const { t } = useAppTranslation();

  return (
    <Dialog
      onClose={onClose}
      open={open}
      title={t('tr_assignmentsHistory')}
      description={person}
      closable
    >
      <AssignmentsHistory history={history} />
    </Dialog>
  );
};

export default AssignmentsHistoryDialog;
