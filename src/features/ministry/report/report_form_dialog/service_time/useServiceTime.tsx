import { useMemo, useRef } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { reportUserDraftState } from '@states/user_field_service_reports';
import { displaySnackNotification } from '@services/recoil/app';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { getMessageByCode } from '@services/i18n/translation';
import { ServiceTimeProps } from './index.types';
import { personIsEnrollmentActive } from '@services/app/persons';
import { handleSaveDailyFieldServiceReport } from '@services/app/user_field_service_reports';
import { hoursCreditsEnabledState } from '@states/settings';
import useMinistryDailyRecord from '@features/ministry/hooks/useMinistryDailyRecord';

const useServiceTime = ({ onClose }: ServiceTimeProps) => {
  const { t } = useAppTranslation();

  const { person } = useCurrentUser();

  const bibleStudyRef = useRef<Element>(null);

  const hoursRef = useRef<Element>(null);

  const [currentReport, setCurrentReport] =
    useRecoilState(reportUserDraftState);

  const hoursCreditEnabled = useRecoilValue(hoursCreditsEnabledState);

  const { hours, bibleStudies, hoursCredit } =
    useMinistryDailyRecord(currentReport);

  const monthReport = useMemo(() => {
    if (!currentReport) return;

    const date = currentReport.report_date;
    return date.substring(0, date.length - 3);
  }, [currentReport]);

  const hoursEnabled = useMemo(() => {
    if (!monthReport) return false;

    const isAP = personIsEnrollmentActive(person, 'AP', monthReport);
    const isFR = personIsEnrollmentActive(person, 'FR', monthReport);
    const isFMF = personIsEnrollmentActive(person, 'FMF', monthReport);
    const isFS = personIsEnrollmentActive(person, 'FS', monthReport);

    return isAP || isFR || isFMF || isFS;
  }, [person, monthReport]);

  const handleHoursChange = (value: string) => {
    const newReport = structuredClone(currentReport);

    newReport.report_data.hours.field_service = value;
    newReport.report_data.updatedAt = new Date().toISOString();
    setCurrentReport(newReport);
  };

  const handleHoursCreditChange = (value: string) => {
    const newReport = structuredClone(currentReport);

    newReport.report_data.hours.credit = value;
    newReport.report_data.updatedAt = new Date().toISOString();
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
    newReport.report_data.updatedAt = new Date().toISOString();
    setCurrentReport(newReport);
  };

  const handleSelectPreset = (value: number, name: string) => {
    const newReport = structuredClone(currentReport);

    newReport.report_data.hours.credit = `${value}:00`;
    newReport.report_data.comments = `${name}: {{ hours }}h`;
    newReport.report_data.updatedAt = new Date().toISOString();
    setCurrentReport(newReport);

    displaySnackNotification({
      header: t('tr_ministry'),
      message: t('tr_hoursCreditPresetAddedInfo'),
      severity: 'success',
    });
  };

  const handleSaveReport = async () => {
    if (currentReport.report_date.length === 0) return;

    if (
      !currentReport.report_data.bible_studies.value &&
      currentReport.report_data.hours.field_service.length === 0 &&
      currentReport.report_data.hours.credit.length === 0
    ) {
      return;
    }

    try {
      const report = structuredClone(currentReport);
      report.report_data._deleted = false;
      await handleSaveDailyFieldServiceReport(report);

      onClose();
    } catch (error) {
      console.error(error);

      await displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  const handleDeleteReport = async () => {
    const newReport = structuredClone(currentReport);

    newReport.report_data._deleted = true;
    newReport.report_data.updatedAt = new Date().toISOString();

    await handleSaveDailyFieldServiceReport(newReport);
    onClose();
  };

  return {
    bibleStudyRef,
    hours,
    handleHoursChange,
    bibleStudies,
    handleBibleStudiesChange,
    bibleStudiesValidator,
    handleSaveReport,
    handleHoursCreditChange,
    hoursCredit,
    hoursCreditEnabled,
    hoursEnabled,
    hoursRef,
    handleSelectPreset,
    handleDeleteReport,
  };
};

export default useServiceTime;
