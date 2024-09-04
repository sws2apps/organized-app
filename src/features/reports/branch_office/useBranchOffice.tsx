import { useEffect, useMemo } from 'react';
import { BranchReportType } from '@definition/branch_report';
import {
  buildServiceYearsList,
  currentReportMonth,
  getMonthServiceYear,
} from '@utils/date';
import { useRecoilState } from 'recoil';
import {
  branchSelectedMonthState,
  branchSelectedReportState,
  branchSelectedYearState,
} from '@states/branch_reports';

const useBranchOfficeContainer = () => {
  const [report, setReport] = useRecoilState(branchSelectedReportState);
  const [year, setYear] = useRecoilState(branchSelectedYearState);
  const [month, setMonth] = useRecoilState(branchSelectedMonthState);

  const monthDefault = useMemo(() => {
    return currentReportMonth();
  }, []);

  const yearDefault = useMemo(() => {
    return getMonthServiceYear(monthDefault);
  }, [monthDefault]);

  const serviceYears = useMemo(() => {
    const result = buildServiceYearsList();

    return result;
  }, []);

  const handleReportChange = (value: BranchReportType) => setReport(value);

  const handleYearChange = (value: string) => {
    setYear(value);

    const month = serviceYears
      .find((record) => record.year === value)
      .months.at(0);

    setMonth(month.value);
  };

  const handleMonthChange = (value: string) => setMonth(value);

  useEffect(() => {
    setYear(yearDefault);
  }, [setYear, yearDefault]);

  useEffect(() => {
    setMonth(monthDefault);
  }, [setMonth, monthDefault]);

  return {
    report,
    handleReportChange,
    year,
    handleYearChange,
    month,
    handleMonthChange,
  };
};

export default useBranchOfficeContainer;
