import { IconExport } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import IconLoading from '@components/icon_loading';
import NavBarButton from '@components/nav_bar_button';
import useExportPersons from './useExportPersons';

const ExportPersons = () => {
  const { t } = useAppTranslation();

  const { handleExport, isProcessing } = useExportPersons();

  return (
    <NavBarButton
      text={t('tr_export')}
      onClick={handleExport}
      icon={isProcessing ? <IconLoading /> : <IconExport />}
      disabled={isProcessing}
    ></NavBarButton>
  );
};

export default ExportPersons;
