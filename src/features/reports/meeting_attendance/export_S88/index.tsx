import { useAppTranslation } from '@hooks/index';
import { IconExport } from '@components/icons';
import IconLoading from '@components/icon_loading';
import useExportS88 from './useExportS88';
import NavBarButton from '@components/nav_bar_button';

const ExportS88 = () => {
  const { t } = useAppTranslation();

  const { handleExportS88, isProcessing } = useExportS88();

  return (
    <NavBarButton
      text={t('tr_export')}
      main
      onClick={handleExportS88}
      icon={isProcessing ? <IconLoading /> : <IconExport />}
    ></NavBarButton>
  );
};

export default ExportS88;
