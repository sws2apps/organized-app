import { useMemo, useRef } from 'react';
import { useRecoilState } from 'recoil';
import { reportUserDraftState } from '@states/user_field_service_reports';
import { displaySnackNotification } from '@services/recoil/app';
import { useAppTranslation } from '@hooks/index';
import { getMessageByCode } from '@services/i18n/translation';
import { ServiceTimeProps } from './index.types';
import { dbUserFieldServiceReportsSave } from '@services/dexie/user_field_service_reports';

const useServiceTime = ({ onClose }: ServiceTimeProps) => {
  const { t } = useAppTranslation();

  const bibleStudyRef = useRef<Element>(null);

  const [currentReport, setCurrentReport] =
    useRecoilState(reportUserDraftState);

  const hours = useMemo(() => {
    return currentReport.report_data.hours;
  }, [currentReport]);

  const bibleStudies = useMemo(() => {
    return currentReport.report_data.bible_studies.value;
  }, [currentReport]);

  const handleHoursChange = (value: string) => {
    const newReport = structuredClone(currentReport);

    newReport.report_data.hours = value;
    setCurrentReport(newReport);
  };

  const bibleStudiesValidator = async (value: number) => {
    if (!currentReport) return true;

    const result = currentReport.report_data.bible_studies.records.length;

    if (value < result) {
      await displaySnackNotification({
        header: t('tr_cantDeductStudiesTitle'),
        message: t('tr_cantDeductStudiesDesc'),
        severity: 'error',
      });

      return false;
    }

    return true;
  };

  const handleBibleStudiesChange = async (value: number) => {
    const newReport = structuredClone(currentReport);

    newReport.report_data.bible_studies.value = value;
    setCurrentReport(newReport);
  };

  const handleSaveReport = async () => {
    if (currentReport.report_date.length === 0) return;

    if (
      !currentReport.report_data.bible_studies.value &&
      currentReport.report_data.hours.length === 0
    ) {
      return;
    }

    try {
      await dbUserFieldServiceReportsSave(currentReport);

      onClose();
    } catch (error) {
      await displaySnackNotification({
        header: t('tr_errorTitle'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  return {
    bibleStudyRef,
    hours,
    handleHoursChange,
    bibleStudies,
    handleBibleStudiesChange,
    bibleStudiesValidator,
    handleSaveReport,
  };
};

export default useServiceTime;
