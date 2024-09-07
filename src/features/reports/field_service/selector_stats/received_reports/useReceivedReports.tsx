import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import {
  congFieldServiceReportsState,
  selectedMonthFieldServiceReportState,
} from '@states/field_service_reports';
import usePersons from '@features/persons/hooks/usePersons';

const useReceivedReports = () => {
  const { getPublishersActive } = usePersons();

  const currentMonth = useRecoilValue(selectedMonthFieldServiceReportState);
  const reports = useRecoilValue(congFieldServiceReportsState);

  const publishers_active = useMemo(() => {
    const data = getPublishersActive(currentMonth);

    return data.length;
  }, [currentMonth, getPublishersActive]);

  const received_reports = useMemo(() => {
    const results = reports.filter(
      (record) =>
        record.report_data.report_date === currentMonth &&
        record.report_data.shared_ministry
    );

    return results.length;
  }, [currentMonth, reports]);

  return { publishers_active, received_reports };
};

export default useReceivedReports;
