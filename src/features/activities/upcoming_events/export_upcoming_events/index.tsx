import { IconPrint } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import IconLoading from '@components/icon_loading';
import useExportUpcomingEvents from './useExportUpcomingEvents';
import NavBarButton from '@components/nav_bar_button';

const ExportUpcomingEvents = () => {
  const { t } = useAppTranslation();
  const { isProcessing, handleExport } = useExportUpcomingEvents();

  return (
    <NavBarButton
      text={t('tr_export')}
      icon={
        isProcessing ? (
          <IconLoading color="var(--accent-main)" />
        ) : (
          <IconPrint color="var(--accent-main)" />
        )
      }
      onClick={handleExport}
      disabled={isProcessing}
    ></NavBarButton>
  );
};

export default ExportUpcomingEvents;
