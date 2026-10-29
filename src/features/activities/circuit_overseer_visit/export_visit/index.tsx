import { IconPrint } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { ExportVisitProps } from './index.types';
import useExportVisit from './useExportVisit';
import IconLoading from '@components/icon_loading';
import NavBarButton from '@components/nav_bar_button';

const ExportVisit = (props: ExportVisitProps) => {
  const { t } = useAppTranslation();

  const { isProcessing, handleExport } = useExportVisit(props);

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
      disabled={isProcessing || props.events.length === 0}
    />
  );
};

export default ExportVisit;
