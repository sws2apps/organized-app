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
  } = useAppFeedback();

  return (
    <SnackBar
      open={snackOpen}
      variant={appSeverity}
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
