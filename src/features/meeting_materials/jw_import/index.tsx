import SnackBar from '@components/snackbar';
import useJWMaterialsImport from './useJWMaterialsImport';
import { useAppTranslation } from '@hooks/index';
import { IconCheckCircle } from '@components/icons';
import IconLoading from '@components/icon_loading';

const JWMaterialsImport = () => {
  const { t } = useAppTranslation();

  const { isOpen, handleClose, isCompleted } = useJWMaterialsImport();

  return (
    <SnackBar
      open={isOpen}
      onClose={isCompleted ? handleClose : null}
      messageHeader={
        isCompleted ? t('tr_successfullyImported') : t('tr_JWImport')
      }
      message={
        isCompleted ? t('tr_successfullyImportedDesc') : t('tr_JWImportDesc')
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

export default JWMaterialsImport;
