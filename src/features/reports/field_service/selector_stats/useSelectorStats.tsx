import { useEffect, useMemo, useState } from 'react';
import {
  currentReportMonth,
  getMonthServiceYear,
  buildServiceYearsList,
} from '@utils/date';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  selectedMonthFieldServiceReportState,
  selectedPublisherReportState,
} from '@states/field_service_reports';
import { branchFieldReportsState } from '@states/branch_field_service_reports';

const useSelectorStats = () => {
  const setSelectedPublisher = useSetRecoilState(selectedPublisherReportState);

  const reports = useRecoilValue(branchFieldReportsState);

  const monthDefault = useMemo(() => {
    return currentReportMonth();
  }, []);

  const yearDefault = useMemo(() => {
    return getMonthServiceYear(monthDefault);
  }, [monthDefault]);

  const [month, setMonth] = useRecoilState(
    selectedMonthFieldServiceReportState
  );

  const [year, setYear] = useState(yearDefault);

  const serviceYears = useMemo(() => {
    const result = buildServiceYearsList();

    return result;
  }, []);

  const month_locked = useMemo(() => {
    const report = reports.find((record) => record.report_date === month);

    if (!report) return false;

    return report.report_data.submitted;
  }, [month, reports]);

  const handleYearChange = (value: string) => {
    setSelectedPublisher(undefined);

    setYear(value);

    const month = serviceYears
      .find((record) => record.year === value)
      .months.at(0);

    setMonth(month.value);
  };

  const handleMonthChange = (value: string) => {
    setSelectedPublisher(undefined);

    setMonth(value);
  };

  useEffect(() => {
    setMonth(monthDefault);
  }, [setMonth, monthDefault]);

  return { year, month, handleYearChange, handleMonthChange, month_locked };
};

export default useSelectorStats;
