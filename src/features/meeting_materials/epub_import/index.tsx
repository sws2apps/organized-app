import SnackBar from '@components/snackbar';
import { IconCheckCircle } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import useEPUBMaterialsImport from './useEPUBMaterialsImport';
import WaitingLoader from '@components/waiting_loader';

const EPUBMaterialsImport = () => {
  const { t } = useAppTranslation();

  const { isOpen, isCompleted, handleClose } = useEPUBMaterialsImport();

  return (
    <SnackBar
      open={isOpen}
      onClose={isCompleted ? handleClose : null}
      messageHeader={
        isCompleted ? t('tr_successfullyImported') : t('tr_EPUBImport')
      }
      message={
        isCompleted ? t('tr_successfullyImportedDesc') : t('tr_pleaseWait')
      }
      messageIcon={
        isCompleted ? (
          <IconCheckCircle color="var(--always-white)" />
        ) : (
          <WaitingLoader
            size={24}
            color="var(--always-white)"
            variant="standard"
          />
        )
      }
      variant={isCompleted ? 'success' : 'message-with-button'}
    />
  );
};

export default EPUBMaterialsImport;
