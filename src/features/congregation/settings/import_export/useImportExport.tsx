import { useMemo, useState } from 'react';
import { useAppTranslation } from '@hooks/index';
import { ImportExportType } from './index.types';
import Import from './import';
import Export from './export';

const useImportExport = ({ onClose }: ImportExportType) => {
  const { t } = useAppTranslation();

  const [value, setValue] = useState(0);

  const tabs = useMemo(() => {
    return [
      {
        label: t('tr_export'),
        Component: <Export onClose={onClose} />,
      },
      {
        label: t('tr_import'),
        Component: <Import onClose={onClose} />,
      },
    ];
  }, [t, onClose]);

  const handleTabChange = (tab: number) => setValue(tab);

  return { tabs, value, handleTabChange };
};

export default useImportExport;
