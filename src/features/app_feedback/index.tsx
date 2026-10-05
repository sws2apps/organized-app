import SnackBar from '@components/snackbar';
import useAppFeedback from './useAppFeedback';
import { IconCheckCircle } from '@components/icons';

const AppFeedback = () => {
  const {
    appMessage,
    appSeverity,
    handleClose,
    snackOpen,
    appMessageHeader,
    appMessageIcon,
    appMessageAction,
  } = useAppFeedback();

  return (
    <SnackBar
      open={snackOpen}
      variant={appMessageAction ? 'message-with-button' : appSeverity}
      actionText={appMessageAction?.text}
      actionClick={
        appMessageAction
          ? () => {
              handleClose();
              appMessageAction.onClick();
            }
          : undefined
      }
      position="bottom-center"
      messageHeader={appMessageHeader}
      message={appMessage}
      onClose={handleClose}
      messageIcon={
        appMessageIcon ? (
          appMessageIcon
        ) : appSeverity === 'success' ? (
          <IconCheckCircle color="var(--always-white)" />
        ) : null
      }
    />
  );
};

export default AppFeedback;
