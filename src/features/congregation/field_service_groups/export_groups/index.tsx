import { IconPrint } from '@components/icons';
import IconLoading from '@components/icon_loading';
import { useAppTranslation } from '@hooks/index';
import useExportGroups from './useExportGroups';
import Button from '@components/button';

const ExportGroups = () => {
  const { t } = useAppTranslation();

  const { handleExport, isProcessing } = useExportGroups();

  return (
    <Button
      variant="secondary"
      onClick={handleExport}
      startIcon={
        isProcessing ? (
          <IconLoading color="var(--accent-main)" />
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
