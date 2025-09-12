import { IconExport } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import useExportPersons from './useExportPersons';
import IconLoading from '@components/icon_loading';
import NavBarButton from '@components/nav_bar_button';

const ExportPersons = () => {
  const { t } = useAppTranslation();

  const { handleExport, isProcessing } = useExportPersons();

  return (
    <NavBarButton
      text={t('tr_export')}
      onClick={handleExport}
      icon={isProcessing ? <IconLoading /> : <IconExport />}
    ></NavBarButton>
  );
};

export default ExportPersons;
