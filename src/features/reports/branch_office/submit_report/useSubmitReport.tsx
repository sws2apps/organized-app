import { useRecoilValue } from 'recoil';
import { SubmitReportProps } from './index.types';
import {
  branchSelectedMonthState,
  branchSelectedReportState,
  branchSelectedYearState,
} from '@states/branch_reports';
import { displaySnackNotification } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import { branchFieldReportsState } from '@states/branch_field_service_reports';
import { dbBranchFieldReportSave } from '@services/dexie/branch_field_service_reports';
import { branchCongAnalysisState } from '@states/branch_cong_analysis';
import { dbBranchCongAnalysisSave } from '@services/dexie/branch_cong_analysis';
import { congFieldServiceReportsState } from '@states/field_service_reports';
import { dbFieldServiceReportsBulkSave } from '@services/dexie/cong_field_service_reports';
import { PersonType } from '@definition/person';
import { dbPersonsBulkSave } from '@services/dexie/persons';
import usePersons from '@features/persons/hooks/usePersons';
import useReportMonthly from '@features/reports/hooks/useReportMonthly';

const useSubmitReport = ({ onClose }: SubmitReportProps) => {
  const report = useRecoilValue(branchSelectedReportState);
  const month = useRecoilValue(branchSelectedMonthState);
  const year = useRecoilValue(branchSelectedYearState);
  const reports = useRecoilValue(branchFieldReportsState);
  const congAnalysis = useRecoilValue(branchCongAnalysisState);
  const congReports = useRecoilValue(congFieldServiceReportsState);

  const { getPublishersActive } = usePersons();
  const { personCheckInactivityState } = useReportMonthly();

  const handleUpdateInactiveState = async () => {
    const personsInactive: PersonType[] = [];

    const active = getPublishersActive(month);

    for (const person of active) {
      const isInactive = personCheckInactivityState(person, month);

      if (!isInactive) continue;

      const [year, varMonth] = month.split('/');
      const endDate = new Date(+year, +varMonth - 1, 0).toISOString();

      const newPerson = structuredClone(person);

      const baptizedActive =
        newPerson.person_data.publisher_baptized.history.find(
          (record) => record._deleted === false && record.end_date === null
        );

      if (baptizedActive) {
        baptizedActive.end_date = endDate;
        baptizedActive.updatedAt = new Date().toISOString();
      }

      const unbaptizedActive =
        newPerson.person_data.publisher_unbaptized.history.find(
          (record) => record._deleted === false && record.end_date === null
        );

      if (unbaptizedActive) {
        unbaptizedActive.end_date = endDate;
        unbaptizedActive.updatedAt = new Date().toISOString();
      }

      personsInactive.push(newPerson);
    }

    if (personsInactive.length > 0) {
      await dbPersonsBulkSave(personsInactive);
    }
  };

  const handleLateReports = async () => {
    const lateReports = congReports.filter(
      (record) =>
        record.report_data.status === 'confirmed' &&
        record.report_data.late.value &&
        record.report_data.late.submitted.length === 0
    );

    const reportsToSave = lateReports.map((report) => {
      const obj = structuredClone(report);
      obj.report_data.late.submitted = month;

      return obj;
    });

    await dbFieldServiceReportsBulkSave(reportsToSave);
  };

  const handleS1 = async () => {
    // mark all late reports as submitted
    await handleLateReports();

    // save status
    const currentReport = reports.find(
      (record) => record.report_date === month
    );

    const report = structuredClone(currentReport);
    report.report_data.submitted = true;
    report.report_data.updatedAt = new Date().toISOString();

    await dbBranchFieldReportSave(report);

    // update publishers inactive state
    await handleUpdateInactiveState();
  };

  const handleS10 = async () => {
    const currentAnalysis = congAnalysis.find(
      (record) => record.report_date === year
    );

    const analyis = structuredClone(currentAnalysis);
    analyis.report_data.submitted = true;
    analyis.report_data.updatedAt = new Date().toISOString();

    await dbBranchCongAnalysisSave(analyis);
  };

  const handleSubmitted = async () => {
    try {
      if (report === 'S-1') {
        await handleS1();
      }

      if (report === 'S-10') {
        await handleS10();
      }

      onClose?.();
    } catch (error) {
      console.error(error);

      await displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  return { handleSubmitted };
};

export default useSubmitReport;
