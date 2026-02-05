import { IconPrint } from '@components/icons';
import IconLoading from '@components/icon_loading';
import { useAppTranslation } from '@hooks/index';
import useExportGroups from './useExportGroups';
import NavBarButton from '@components/nav_bar_button';

const ExportGroups = () => {
  const { t } = useAppTranslation();

  const { handleExport, isProcessing } = useExportGroups();

  return (
    <NavBarButton
      text={t('tr_export')}
      onClick={handleExport}
      icon={
        isProcessing ? (
          <IconLoading color="var(--accent-main)" />
        ) : (
          <IconPrint color="var(--accent-main)" />
        )
      }
      disabled={isProcessing}
    />
  );
};

export default ExportGroups;
