import Button from '@components/button';
import { IconPrint } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import useExportUpcomingEvents from './useExportUpcomingEvents';

const ExportUpcomingEvents = () => {
  const { t } = useAppTranslation();
  const { handleExportButtonClick } = useExportUpcomingEvents();

  return (
    <Button
      variant="secondary"
      startIcon={<IconPrint />}
      onClick={handleExportButtonClick}
    >
      {t('tr_export')}
    </Button>
  );
};

export default ExportUpcomingEvents;
