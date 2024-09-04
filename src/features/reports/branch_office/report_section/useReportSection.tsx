import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import {
  branchSelectedMonthState,
  branchSelectedReportState,
  branchSelectedYearState,
} from '@states/branch_reports';
import { branchFieldReportsState } from '@states/branch_field_service_reports';
import { branchCongAnalysisState } from '@states/branch_cong_analysis';

const useReportSection = () => {
  const report = useRecoilValue(branchSelectedReportState);
  const year = useRecoilValue(branchSelectedYearState);
  const month = useRecoilValue(branchSelectedMonthState);
  const fieldReports = useRecoilValue(branchFieldReportsState);
  const congAnalysis = useRecoilValue(branchCongAnalysisState);

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

  return { generated, submitted };
};

export default useReportSection;
