import { useAppTranslation } from '@hooks/index';
import { IconExport, IconLoading } from '@components/icons';
import useExportS88 from './useExportS88';
import Button from '@components/button';

const ExportS88 = () => {
  const { t } = useAppTranslation();

  const { handleExportS88, isProcessing } = useExportS88();

  return (
    <Button
      variant="secondary"
      onClick={handleExportS88}
      startIcon={isProcessing ? <IconLoading /> : <IconExport />}
    >
      {t('tr_exportS88')}
    </Button>
  );
};

export default ExportS88;
