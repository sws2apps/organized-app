import { useMemo, useState } from 'react';
import { useAppTranslation } from '@hooks/index';
import { DialogType, ImportExportType, ImportFileData } from './index.types';
import Import from './import';
import Export from './export';

const useImportExport = ({ onClose }: ImportExportType) => {
  const { t } = useAppTranslation();

  const [fileData, setFileData] = useState<ImportFileData | null>(null);

  const [value, setValue] = useState(0);
  const [state, setState] = useState<DialogType>('import/export');

  const handleOpenImportExport = () => setState('import/export');

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
    setFileData,
  };
};

export default useImportExport;
