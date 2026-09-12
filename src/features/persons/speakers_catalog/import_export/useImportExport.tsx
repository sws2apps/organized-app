// src/features/persons/speakers_catalog/import_export/useImportExport.tsx
import { useMemo, useState } from 'react';
import { useAppTranslation } from '@hooks/index';
import { DialogType, ImportExportType, ImportFileData } from './index.types';
import Import from './import';
import Export from './export';

/**
 * Hook orchestrating the import/export dialog of the speakers catalog.
 * Manages two independent pieces of state: the active tab (`value`) and
 * the wizard phase (`state`) – after a successful file upload the dialog
 * switches from "import/export" to "import/confirm". It also stages the
 * uploaded file data (`fileData`), which the import step writes and the
 * confirm step reads.
 */
const useImportExport = ({ onClose }: ImportExportType) => {
  const { t } = useAppTranslation();

  const [fileData, setFileData] = useState<ImportFileData | null>(null);

  const [value, setValue] = useState(0);
  const [state, setState] = useState<DialogType>('import/export');

  /** Switches the dialog back to the tabbed import/export view. */
  const handleOpenImportExport = () => setState('import/export');

  /** Advances the dialog to the confirm step (called after a file was accepted). */
  const handleOpenConfirm = () => setState('import/confirm');

  const tabs = useMemo(() => {
    return [
      {
        label: t('tr_export'),
        Component: <Export onClose={onClose} />,
      },
      {
        label: t('tr_import'),
        Component: (
          <Import
            setFileData={setFileData}
            onClose={onClose}
            onNext={handleOpenConfirm}
          />
        ),
      },
    ];
  }, [t, onClose]);

  const handleTabChange = (tab: number) => setValue(tab);

  return {
    tabs,
    value,
    handleTabChange,
    state,
    handleOpenImportExport,
    fileData,
  };
};

export default useImportExport;
