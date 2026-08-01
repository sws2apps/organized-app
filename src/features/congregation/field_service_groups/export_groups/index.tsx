import { useState } from 'react';
import { IconPrint } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { ExportGroupsSettings } from './index.types';
import ExportGroupsDialog from './ExportGroupsDialog';
import IconLoading from '@components/icon_loading';
import NavBarButton from '@components/nav_bar_button';
import useExportGroups from './useExportGroups';

const ExportGroups = ({ main }: { main?: boolean }) => {
  const { t } = useAppTranslation();

  const { handleExport, isProcessing } = useExportGroups();

  const [open, setOpen] = useState(false);

  const handleExportWithSettings = async (settings: ExportGroupsSettings) => {
    await handleExport(settings);

    setOpen(false);
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
