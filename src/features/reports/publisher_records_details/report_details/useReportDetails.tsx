import { useEffect, useMemo } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { AssignmentCode } from '@definition/assignment';
import { monthNamesState } from '@states/app';
import {
  congFieldServiceReportsState,
  publisherCurrentReportState,
} from '@states/field_service_reports';
import { ReportDetailsProps } from './index.types';
import { CongFieldServiceReportType } from '@definition/cong_field_service_reports';
import { congFieldServiceReportSchema } from '@services/dexie/schema';
import { displaySnackNotification } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import { handleSaveFieldServiceReports } from '@services/app/cong_field_service_reports';
import usePerson from '@features/persons/hooks/usePerson';

const useReportDetails = ({ month, person, onClose }: ReportDetailsProps) => {
  const { personIsEnrollmentActive } = usePerson();

  const [currentReport, setCurrentReport] = useRecoilState(
    publisherCurrentReportState
  );

  const monthNames = useRecoilValue(monthNamesState);
  const congReports = useRecoilValue(congFieldServiceReportsState);

  const reportMonth = useMemo(() => {
    const [year, monthIndex] = month.split('/').map(Number);

    return `${monthNames[monthIndex - 1]} ${year}`;
  }, [month, monthNames]);

  const report = useMemo(() => {
    return congReports.find(
      (record) =>
        record.report_data.person_uid === person.person_uid &&
        record.report_data.report_date === month
    );
  }, [congReports, person, month]);

  const creditEnabled = useMemo(() => {
    if (!person) return false;

    const isValid = person.person_data.assignments.some(
      (record) =>
        record._deleted === false &&
        record.code === AssignmentCode.MINISTRY_HOURS_CREDIT
    );
    return isValid;
  }, [person]);

  const isAP = useMemo(() => {
    if (!person) return false;

    return personIsEnrollmentActive(person, 'AP', month);
  }, [person, month, personIsEnrollmentActive]);

  const isFMF = useMemo(() => {
    if (!person) return false;

    return personIsEnrollmentActive(person, 'FMF', month);
  }, [person, month, personIsEnrollmentActive]);

  const isFR = useMemo(() => {
    if (!person) return false;

    return personIsEnrollmentActive(person, 'FR', month);
  }, [person, month, personIsEnrollmentActive]);

  const isFS = useMemo(() => {
    if (!person) return false;

    return personIsEnrollmentActive(person, 'FS', month);
  }, [person, month, personIsEnrollmentActive]);

  const hoursEnabled = useMemo(() => {
    return isAP || isFMF || isFR || isFS;
  }, [isAP, isFMF, isFR, isFS]);

  const handleSaveReport = async () => {
    try {
      await handleSaveFieldServiceReports(currentReport);

      onClose?.();
    } catch (error) {
      await displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  useEffect(() => {
    let userReport: CongFieldServiceReportType;

    if (!report) {
      userReport = structuredClone(congFieldServiceReportSchema);
      userReport.report_id = crypto.randomUUID();
      userReport.report_data.report_date = month;
      userReport.report_data.person_uid = person.person_uid;
    }

    if (report) {
      userReport = structuredClone(report);
    }

    setCurrentReport(userReport);
  }, [report, setCurrentReport, month, person]);

  return { reportMonth, creditEnabled, hoursEnabled, handleSaveReport };
};

export default useReportDetails;
