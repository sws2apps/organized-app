import Button from '@components/button';
import { IconPrint } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import useExportUpcomingEvents from './useExportUpcomingEvents';
import IconLoading from '@components/icon_loading';

const ExportUpcomingEvents = () => {
  const { t } = useAppTranslation();
  const { handleExport, isProcessing, showExportButton } =
    useExportUpcomingEvents();

  return (
    showExportButton && (
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
    )
  );
};

export default ExportUpcomingEvents;
