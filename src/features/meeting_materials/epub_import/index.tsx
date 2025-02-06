import SnackBar from '@components/snackbar';
import { IconCheckCircle } from '@components/icons';
import IconLoading from '@components/icon_loading';
import { useAppTranslation } from '@hooks/index';
import useEPUBMaterialsImport from './useEPUBMaterialsImport';

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
          <IconLoading color="var(--always-white)" />
        )
      }
      variant={isCompleted ? 'success' : 'message-with-button'}
    />
  );
};

export default EPUBMaterialsImport;
