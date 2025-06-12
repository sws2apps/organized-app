import { IconExport } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import useExportPersons from './useExportPersons';
import Button from '@components/button';
import IconLoading from '@components/icon_loading';

const ExportPersons = () => {
  const { t } = useAppTranslation();

  const { handleExport, isProcessing } = useExportPersons();

  return (
    <Button
      variant="secondary"
      onClick={handleExport}
      startIcon={isProcessing ? <IconLoading /> : <IconExport />}
    >
      {t('tr_export')}
    </Button>
  );
};

export default ExportPersons;
