import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { useCurrentUser } from '@hooks/index';
import { PersonType } from '@definition/person';
import {
  congFieldServiceReportsState,
  selectedMonthFieldServiceReportState,
} from '@states/field_service_reports';
import { CongFieldServiceReportType } from '@definition/cong_field_service_reports';
import { congFieldServiceReportSchema } from '@services/dexie/schema';
import { handleSaveFieldServiceReports } from '@services/app/cong_field_service_reports';
import { displaySnackNotification } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import { branchFieldReportsState } from '@states/branch_field_service_reports';
import usePerson from '@features/persons/hooks/usePerson';

const useMinistryShared = (person: PersonType) => {
  const { isSecretary } = useCurrentUser();

  const { personIsBaptizedPublisher, personIsUnbaptizedPublisher } =
    usePerson();

  const reports = useRecoilValue(congFieldServiceReportsState);
  const currentMonth = useRecoilValue(selectedMonthFieldServiceReportState);
  const branchReports = useRecoilValue(branchFieldReportsState);

  const currentReport = useMemo(() => {
    return reports.find(
      (record) =>
        record.report_data.report_date === currentMonth &&
        record.report_data.person_uid === person.person_uid
    );
  }, [reports, currentMonth, person]);

  const isInactive = useMemo(() => {
    if (!person) return true;

    const isBaptized = personIsBaptizedPublisher(person, currentMonth);
    const isUnbaptized = personIsUnbaptizedPublisher(person, currentMonth);

    const active = isBaptized || isUnbaptized;

    return !active;
  }, [
    person,
    currentMonth,
    personIsBaptizedPublisher,
    personIsUnbaptizedPublisher,
  ]);

  const readOnly = useMemo(() => {
    if (isInactive) return true;

    const branchReport = branchReports.find(
      (record) => record.report_date === currentMonth
    );

    if (!branchReport) return false;

    const isLate =
      currentReport?.report_data.late.value &&
      currentReport?.report_data.late.submitted.length === 0;

    if (isLate) return false;

    return branchReport.report_data.submitted;
  }, [branchReports, currentMonth, currentReport, isInactive]);

  const checked = useMemo(() => {
    if (!currentReport) return false;

    return currentReport.report_data.shared_ministry;
  }, [currentReport]);

  const handleCheckedChange = async (value: boolean) => {
    try {
      let report: CongFieldServiceReportType;

      if (!currentReport) {
        report = structuredClone(congFieldServiceReportSchema);
        report.report_id = crypto.randomUUID();
        report.report_data.report_date = currentMonth;
        report.report_data.person_uid = person.person_uid;
      }

      if (currentReport) {
        report = structuredClone(currentReport);
      }

      report.report_data.shared_ministry = value;
      report.report_data.status = isSecretary ? 'confirmed' : 'received';
      report.report_data.updatedAt = new Date().toISOString();

      await handleSaveFieldServiceReports(report);
    } catch (error) {
      await displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  return { checked, handleCheckedChange, readOnly };
};

export default useMinistryShared;
