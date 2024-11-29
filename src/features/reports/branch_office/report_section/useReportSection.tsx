import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import {
  branchSelectedMonthState,
  branchSelectedReportState,
  branchSelectedYearState,
} from '@states/branch_reports';
import { branchFieldReportsState } from '@states/branch_field_service_reports';
import { branchCongAnalysisState } from '@states/branch_cong_analysis';
import { displaySnackNotification } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import { congFieldServiceReportsState } from '@states/field_service_reports';
import { CongFieldServiceReportType } from '@definition/cong_field_service_reports';
import { personsState } from '@states/persons';
import { BranchFieldServiceReportType } from '@definition/branch_field_service_reports';
import {
  SchemaBranchCongAnalysis,
  SchemaBranchFieldServiceReport,
} from '@services/dexie/schema';
import { dbBranchFieldReportSave } from '@services/dexie/branch_field_service_reports';
import { BranchCongAnalysisType } from '@definition/branch_cong_analysis';
import { dbBranchCongAnalysisSave } from '@services/dexie/branch_cong_analysis';
import usePerson from '@features/persons/hooks/usePerson';
import usePersons from '@features/persons/hooks/usePersons';
import useMeetingAttendance from '@features/reports/meeting_attendance/hooks/useMeetingAttendance';
import useYearlyAttendance from '@features/reports/meeting_attendance/hooks/useYearlyAttendance';
import useReportYearly from '@features/reports/hooks/useReportYearly';
import useReportMonthly from '@features/reports/hooks/useReportMonthly';

const useReportSection = () => {
  const { personIsEnrollmentActive } = usePerson();

  const { getPublishersActive, getPublishersInactiveYears } = usePersons();

  const { getPublishersReactivatedYears } = useReportYearly();

  const { getPublishersActiveForBranch } = useReportMonthly();

  const report = useRecoilValue(branchSelectedReportState);
  const year = useRecoilValue(branchSelectedYearState);
  const month = useRecoilValue(branchSelectedMonthState);
  const fieldReports = useRecoilValue(branchFieldReportsState);
  const congAnalysis = useRecoilValue(branchCongAnalysisState);
  const congReports = useRecoilValue(congFieldServiceReportsState);
  const persons = useRecoilValue(personsState);

  const { weekend } = useMeetingAttendance(month);

  const { getMeetingAverage } = useYearlyAttendance(year);

  const fieldReport = useMemo(() => {
    if (report !== 'S-1') return;

    return fieldReports.find((record) => record.report_date === month);
  }, [report, fieldReports, month]);

  const analysisReport = useMemo(() => {
    if (report !== 'S-10') return;

    return congAnalysis.find((record) => record.report_date === year);
  }, [report, congAnalysis, year]);

  const generated = useMemo(() => {
    if (report === 'S-1') {
      return fieldReport ? true : false;
    }

    if (report === 'S-10') {
      return analysisReport ? true : false;
    }

    return false;
  }, [report, fieldReport, analysisReport]);

  const submitted = useMemo(() => {
    if (report === 'S-1') {
      if (!fieldReport) return false;

      return fieldReport.report_data.submitted;
    }

    if (report === 'S-10') {
      if (!analysisReport) return false;

      return analysisReport.report_data.submitted;
    }

    return false;
  }, [report, fieldReport, analysisReport]);

  const handleFilterReports = () => {
    // get all confirmed reports and unsubmitted late reports
    const reports = congReports.filter(
      (record) =>
        record.report_data.status === 'confirmed' &&
        ((record.report_data.shared_ministry &&
          record.report_data.report_date === month) ||
          (record.report_data.late.value &&
            record.report_data.late.submitted.length === 0))
    );

    // group reports
    const publishers: CongFieldServiceReportType[] = [];
    const APs: CongFieldServiceReportType[] = [];
    const FRs: CongFieldServiceReportType[] = [];

    for (const report of reports) {
      const person = persons.find(
        (record) => record.person_uid === report.report_data.person_uid
      );

      if (!person) continue;

      const isAP = personIsEnrollmentActive(person, 'AP', month);
      const isFMF = personIsEnrollmentActive(person, 'FMF', month);
      const isFR = personIsEnrollmentActive(person, 'FR', month);
      const isFS = personIsEnrollmentActive(person, 'FS', month);

      // skip SFTS reports
      if (isFMF || isFS) continue;

      if (isAP) {
        APs.push(report);
        continue;
      }

      if (isFR) {
        FRs.push(report);
        continue;
      }

      // default to publishers
      publishers.push(report);
    }

    return { publishers, APs, FRs };
  };

  const handleCountBibleStudies = (reports: CongFieldServiceReportType[]) => {
    const total = reports.reduce(
      (acc, current) => acc + current.report_data.bible_studies,
      0
    );

    return total;
  };

  const handleCountHours = (reports: CongFieldServiceReportType[]) => {
    const total = reports.reduce(
      (acc, current) => acc + current.report_data.hours.field_service,
      0
    );

    return total;
  };

  const handleGenerateS1 = async () => {
    const { APs, FRs, publishers } = handleFilterReports();

    // create branch record
    let branchReport: BranchFieldServiceReportType;

    if (!fieldReport) {
      branchReport = structuredClone(SchemaBranchFieldServiceReport);
      branchReport.report_date = month;
    }

    if (fieldReport) {
      branchReport = structuredClone(fieldReport);
    }

    branchReport.report_data.publishers_active =
      getPublishersActiveForBranch(month).length;

    branchReport.report_data.weekend_meeting_average = weekend.average;

    branchReport.report_data.publishers = {
      report_count: publishers.length,
      bible_studies: handleCountBibleStudies(publishers),
    };
    branchReport.report_data.APs = {
      report_count: APs.length,
      hours: handleCountHours(APs),
      bible_studies: handleCountBibleStudies(APs),
    };
    branchReport.report_data.FRs = {
      report_count: FRs.length,
      hours: handleCountHours(FRs),
      bible_studies: handleCountBibleStudies(FRs),
    };
    branchReport.report_data.updatedAt = new Date().toISOString();

    await dbBranchFieldReportSave(branchReport);
  };

  const handleGenerateS10 = async () => {
    // create analysis report
    let analysis: BranchCongAnalysisType;

    if (!analysisReport) {
      analysis = structuredClone(SchemaBranchCongAnalysis);
      analysis.report_date = year;
    }

    if (analysisReport) {
      analysis = structuredClone(analysisReport);
    }

    // meeting
    analysis.report_data.meeting_average.midweek = getMeetingAverage('midweek');
    analysis.report_data.meeting_average.weekend = getMeetingAverage('weekend');

    // field service
    const lastMonth = `${year}/08`;
    analysis.report_data.publishers.active =
      getPublishersActive(lastMonth).length;
    analysis.report_data.publishers.inactive =
      getPublishersInactiveYears(year).length;
    analysis.report_data.publishers.reactivated =
      getPublishersReactivatedYears(year).length;

    analysis.report_data.updatedAt = new Date().toISOString();

    await dbBranchCongAnalysisSave(analysis);
  };

  const handleGenerate = async () => {
    try {
      if (report === 'S-1') {
        await handleGenerateS1();
      }

      if (report === 'S-10') {
        await handleGenerateS10();
      }
    } catch (error) {
      console.error(error);

      await displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  return { generated, submitted, handleGenerate };
};

export default useReportSection;
