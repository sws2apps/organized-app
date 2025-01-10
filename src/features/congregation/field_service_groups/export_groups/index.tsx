import { IconPrint } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import useExportGroups from './useExportGroups';
import Button from '@components/button';
import WaitingLoader from '@components/waiting_loader';

const ExportGroups = () => {
  const { t } = useAppTranslation();

  const { handleExport, isProcessing } = useExportGroups();

  return (
    <Button
      variant="secondary"
      onClick={handleExport}
      startIcon={
        isProcessing ? (
          <WaitingLoader variant="standard" size={22} />
        ) : (
          <IconPrint color="var(--accent-main)" />
        )
      }
    >
      {t('tr_export')}
    </Button>
  );
};

export default ExportGroups;
