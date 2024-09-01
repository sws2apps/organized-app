import { useMemo, useRef } from 'react';
import { useRecoilState } from 'recoil';
import { reportUserDraftState } from '@states/user_field_service_reports';
import { displaySnackNotification } from '@services/recoil/app';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { getMessageByCode } from '@services/i18n/translation';
import { ServiceTimeProps } from './index.types';
import useMinistryDailyRecord from '@features/ministry/hooks/useMinistryDailyRecord';
import { AssignmentCode } from '@definition/assignment';
import { personIsEnrollmentActive } from '@services/app/persons';
import { handleSaveDailyFieldServiceReport } from '@services/app/user_field_service_reports';

const useServiceTime = ({ onClose }: ServiceTimeProps) => {
  const { t } = useAppTranslation();

  const { person } = useCurrentUser();

  const bibleStudyRef = useRef<Element>(null);

  const [currentReport, setCurrentReport] =
    useRecoilState(reportUserDraftState);

  const { hours, bibleStudies, approved_assignments } =
    useMinistryDailyRecord(currentReport);

  const monthReport = useMemo(() => {
    const date = currentReport.report_date;
    return date.substring(0, date.length - 3);
  }, [currentReport]);

  const hoursEnabled = useMemo(() => {
    const isAP = personIsEnrollmentActive(person, 'AP', monthReport);
    const isFR = personIsEnrollmentActive(person, 'FR', monthReport);
    const isFMF = personIsEnrollmentActive(person, 'FMF', monthReport);
    const isFS = personIsEnrollmentActive(person, 'FS', monthReport);

    return isAP || isFR || isFMF || isFS;
  }, [person, monthReport]);

  const hoursCreditEnabled = useMemo(() => {
    if (!hoursEnabled) return false;

    const assignments = person.person_data.assignments.filter(
      (record) => record._deleted === false
    );

    return assignments.find(
      (record) => record.code === AssignmentCode.MINISTRY_HOURS_CREDIT
    );
  }, [person, hoursEnabled]);

  const handleHoursChange = (value: string) => {
    const newReport = structuredClone(currentReport);

    newReport.report_data.hours = value;
    newReport.report_data.updatedAt = new Date().toISOString();
    setCurrentReport(newReport);
  };

  const handleApprovedAssignmentsChange = (value: string) => {
    const newReport = structuredClone(currentReport);

    newReport.report_data.approved_assignments = value;
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

  const handleSaveReport = async () => {
    if (currentReport.report_date.length === 0) return;

    if (
      !currentReport.report_data.bible_studies.value &&
      currentReport.report_data.hours.length === 0 &&
      currentReport.report_data.approved_assignments.length === 0
    ) {
      return;
    }

    try {
      await handleSaveDailyFieldServiceReport(currentReport);

      onClose();
    } catch (error) {
      console.error(error);

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
    handleApprovedAssignmentsChange,
    approved_assignments,
    hoursCreditEnabled,
    hoursEnabled,
  };
};

export default useServiceTime;
