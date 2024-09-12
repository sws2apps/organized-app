import { useState } from 'react';
import { useAppTranslation } from '@hooks/index';
import { displaySnackNotification } from '@services/recoil/app';
import { ExportS21Props, ExportType } from './index.types';
import { getMessageByCode } from '@services/i18n/translation';

const useExportS21 = ({ onClose }: ExportS21Props) => {
  const { t } = useAppTranslation();

  const [type, setType] = useState<ExportType>('all');
  const [allOpen, setAllOpen] = useState(true);
  const [selectOpen, setSelectOpen] = useState(false);

  const handleChangeType = (value: ExportType) => setType(value);

  const handleAction = async () => {
    try {
      if (type === 'select') {
        setAllOpen(false);
        setSelectOpen(true);
      }

      if (type === 'all') {
        // run export

        onClose?.();
      }
    } catch (error) {
      console.error(error);

      await displaySnackNotification({
        header: t('tr_errorTitle'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  return { type, handleChangeType, allOpen, selectOpen, handleAction };
};

export default useExportS21;
