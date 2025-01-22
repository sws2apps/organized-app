import { IconSend, IconUndo } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { FormS4Props } from '../index.types';
import useSubmitButton from './useSubmitButton';
import Button from '@components/button';
import SubmitReport from '../submit_report';
import WithdrawReport from '../withdraw_report';

const SubmitButton = (props: FormS4Props) => {
  const { t } = useAppTranslation();

  const {
    status,
    disabled,
    handleCloseSubmit,
    handleCloseWithdraw,
    handleOpenModal,
    submitOpen,
    withdrawOpen,
  } = useSubmitButton(props);

  return (
    <>
      {submitOpen && (
        <SubmitReport
          open={submitOpen}
          onClose={handleCloseSubmit}
          month={props.month}
          person_uid={props.person_uid}
        />
      )}

      {withdrawOpen && (
        <WithdrawReport
          open={withdrawOpen}
          onClose={handleCloseWithdraw}
          month={props.month}
          person_uid={props.person_uid}
        />
      )}

      <Button
        variant="main"
        onClick={handleOpenModal}
        disabled={disabled}
        color={status !== 'pending' && 'orange'}
        startIcon={status === 'pending' ? <IconSend /> : <IconUndo />}
      >
        {status === 'pending'
          ? t('tr_btnSubmitReport')
          : t('tr_undoSubmission')}
      </Button>
    </>
  );
};

export default SubmitButton;
