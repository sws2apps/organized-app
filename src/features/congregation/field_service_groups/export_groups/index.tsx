import { useState } from 'react';
import { IconPrint } from '@components/icons';
import IconLoading from '@components/icon_loading';
import { useAppTranslation } from '@hooks/index';
import useExportGroups, { ExportSettings } from './useExportGroups';
import NavBarButton from '@components/nav_bar_button';
import ExportGroupsDialog from './ExportGroupsDialog';

const ExportGroups = ({ main }: { main?: boolean }) => {
  const { t } = useAppTranslation();
  const [open, setOpen] = useState(false);

  const { handleExport, isProcessing } = useExportGroups();

  const handleExportWithSettings = async (settings: ExportSettings) => {
    setOpen(false);
    await handleExport(settings);
  };

  return (
    <>
      <NavBarButton
        text={t('tr_export')}
        main={main}
        onClick={() => setOpen(true)}
        icon={
          isProcessing ? (
            <IconLoading color="var(--accent-main)" />
          ) : (
            <IconPrint color="var(--accent-main)" />
          )
        }
        disabled={isProcessing}
      />
      {open && (
        <ExportGroupsDialog
          open={open}
          onClose={() => setOpen(false)}
          onExport={handleExportWithSettings}
          isProcessing={isProcessing}
        />
      )}
    </>
  );
};

export default ExportGroups;
