import SnackBar from '@components/snackbar';
import useJWMaterialsImport from './useJWMaterialsImport';
import { useAppTranslation } from '@hooks/index';
import { IconLoading } from '@components/icons';

const JWMaterialsImport = () => {
  const { t } = useAppTranslation();

  const { isOpen } = useJWMaterialsImport();

  return (
    <SnackBar
      open={isOpen}
      messageHeader={t('tr_JWImport')}
      message={t('tr_JWImportDesc')}
      messageIcon={<IconLoading color="var(--always-white)" />}
      variant="message-with-button"
    />
  );
};

export default JWMaterialsImport;
