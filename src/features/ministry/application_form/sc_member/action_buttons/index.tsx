import { IconCancelCicle, IconCheckCircle } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { ActionButton } from '../index.styles';
import { ActionButtonsProps } from './index.types';
import useActionButtons from './useActionButtons';
import WaitingLoader from '@components/waiting_loader';

const ActionButtons = (props: ActionButtonsProps) => {
  const { t } = useAppTranslation();

  const {
    handleApprove,
    handleReject,
    isApproveProcessing,
    isRejectProcessing,
  } = useActionButtons(props);

  return (
    <>
      <ActionButton
        variant="main"
        color="red"
        startIcon={
          isRejectProcessing ? (
            <WaitingLoader size={22} variant="standard" />
          ) : (
            <IconCancelCicle color="var(--always-white)" />
          )
        }
        onClick={handleReject}
      >
        {t('tr_reject')}
      </ActionButton>
      <ActionButton
        variant="main"
        startIcon={
          isApproveProcessing ? (
            <WaitingLoader size={22} variant="standard" />
          ) : (
            <IconCheckCircle color="var(--always-white)" />
          )
        }
        onClick={handleApprove}
      >
        {t('tr_approve')}
      </ActionButton>
    </>
  );
};

export default ActionButtons;
