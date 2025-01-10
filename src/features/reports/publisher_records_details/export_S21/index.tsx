import { IconExport } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import useExportS21 from './useExportS21';
import Button from '@components/button';
import WaitingLoader from '@components/waiting_loader';

const ExportS21 = () => {
  const { t } = useAppTranslation();

  const { handleExport, isProcessing } = useExportS21();

  return (
    <Button
      onClick={handleExport}
      disabled={isProcessing}
      startIcon={
        isProcessing ? (
          <WaitingLoader size={22} variant="standard" />
        ) : (
          <IconExport />
        )
      }
    >
      {t('tr_exportS21')}
    </Button>
  );
};

export default ExportS21;
