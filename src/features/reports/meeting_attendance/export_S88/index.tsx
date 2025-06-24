import { useAppTranslation } from '@hooks/index';
import { IconPrint } from '@components/icons';
import IconLoading from '@components/icon_loading';
import useExportS88 from './useExportS88';
import Button from '@components/button';

const ExportS88 = () => {
  const { t } = useAppTranslation();

  const { handleExportS88, isProcessing } = useExportS88();

  return (
    <Button
      variant="main"
      onClick={handleExportS88}
      startIcon={isProcessing ? <IconLoading /> : <IconPrint />}
    >
      {t('tr_export')}
    </Button>
  );
};

export default ExportS88;
