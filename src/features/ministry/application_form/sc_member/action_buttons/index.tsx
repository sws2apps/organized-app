import { IconCancelCicle, IconCheckCircle } from '@components/icons';
import IconLoading from '@components/icon_loading';
import { useAppTranslation } from '@hooks/index';
import { ActionButton } from '../index.styles';
import { ActionButtonsProps } from './index.types';
import useActionButtons from './useActionButtons';

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
            <IconLoading />
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
            <IconLoading />
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
