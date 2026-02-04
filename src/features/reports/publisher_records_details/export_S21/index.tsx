import { IconExport } from '@components/icons';
import IconLoading from '@components/icon_loading';
import { useAppTranslation } from '@hooks/index';
import useExportS21 from './useExportS21';
import NavBarButton from '@components/nav_bar_button';

const ExportS21 = () => {
  const { t } = useAppTranslation();

  const { handleExport, isProcessing } = useExportS21();

  return (
    <NavBarButton
      text={t('tr_exportS21')}
      onClick={handleExport}
      disabled={isProcessing}
      icon={isProcessing ? <IconLoading /> : <IconExport />}
    ></NavBarButton>
  );
};

export default ExportS21;
