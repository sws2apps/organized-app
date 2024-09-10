import { IconExport, IconLoading } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import useExportS21 from './useExportS21';
import Button from '@components/button';

const ExportS21 = () => {
  const { t } = useAppTranslation();

  const { handleExport, isProcessing } = useExportS21();

  return (
    <Button
      onClick={handleExport}
      disabled={isProcessing}
      startIcon={isProcessing ? <IconLoading /> : <IconExport />}
    >
      {t('tr_exportS21')}
    </Button>
  );
};

export default ExportS21;
