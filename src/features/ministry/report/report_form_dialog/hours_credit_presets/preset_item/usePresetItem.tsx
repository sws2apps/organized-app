import { useRecoilState } from 'recoil';
import { PresetItemProps } from './index.types';
import { reportUserDraftState } from '@states/user_field_service_reports';
import { displaySnackNotification } from '@services/recoil/app';
import { useAppTranslation } from '@hooks/index';

const usePreestItem = ({ onClose, preset }: PresetItemProps) => {
  const { t } = useAppTranslation();

  const [currentReport, setCurrentReport] =
    useRecoilState(reportUserDraftState);

  const handleSelectPreset = () => {
    const newReport = structuredClone(currentReport);

    newReport.report_data.hours.credit = `${preset.value}:00`;
    newReport.report_data.comments = `${preset.name}: {{ hours }}h`;
    newReport.report_data.updatedAt = new Date().toISOString();
    setCurrentReport(newReport);

    displaySnackNotification({
      header: t('tr_ministry'),
      message: t('tr_hoursCreditPresetAddedInfo'),
      severity: 'success',
    });

    onClose();
  };

  return { handleSelectPreset, preset };
};

export default usePreestItem;
