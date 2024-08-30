import { ReactElement, useEffect, useMemo, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { IconCheck, IconReportNotSent } from '@components/icons';
import { buildPublisherReportMonths, currentReportMonth } from '@utils/date';
import {
  reportUserSelectedMonthState,
  userFieldServiceMonthlyReportsState,
} from '@states/user_field_service_reports';

const useMonthlyReport = () => {
  const [selectedMonth, setSelectedMonth] = useRecoilState(
    reportUserSelectedMonthState
  );

  const reports = useRecoilValue(userFieldServiceMonthlyReportsState);

  const [initialValue, setInitialValue] = useState<number | boolean>(false);

  const monthsList = useMemo(() => {
    const results = buildPublisherReportMonths();
    return results;
  }, []);

  const monthsTab = useMemo(() => {
    const currentMonth = currentReportMonth();

    return monthsList.map((month) => {
      let icon: ReactElement;

      if (month.value < currentMonth) {
        const monthInReport = reports.find(
          (record) => record.report_date === month.value
        );
        if (monthInReport) {
          if (monthInReport.report_data.shared_ministry) {
            icon = (
              <IconCheck height={20} width={20} color="var(--accent-400)" />
            );
          }

          if (!monthInReport.report_data.shared_ministry) {
            icon = (
              <IconReportNotSent
                height={20}
                width={20}
                color="var(--red-main) !important"
              />
            );
          }
        }
      }

      return {
        label: month.label,
        icon,
      };
    });
  }, [monthsList, reports]);

  const handleMonthChange = (value: number) => {
    setSelectedMonth(monthsList.at(value).value);
  };

  useEffect(() => {
    setSelectedMonth('');

    setTimeout(() => {
      const current = currentReportMonth();

      const value = monthsList.findIndex((record) => record.value === current);
      setSelectedMonth(monthsList.at(value).value);

      setInitialValue(value);
    }, 500);
  }, [monthsList, setSelectedMonth]);

  return { monthsTab, initialValue, handleMonthChange, selectedMonth };
};

export default useMonthlyReport;
