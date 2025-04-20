import { useMemo } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { PersonItemProps, ReportStatus } from './index.types';
import {
  congFieldServiceReportsState,
  selectedMonthFieldServiceReportState,
  selectedPublisherReportState,
} from '@states/field_service_reports';

const usePersonItem = ({ person }: PersonItemProps) => {
  const [selected, setSelected] = useAtom(selectedPublisherReportState);

  const currentMonth = useAtomValue(selectedMonthFieldServiceReportState);
  const reports = useAtomValue(congFieldServiceReportsState);

  const isSelected = useMemo(() => {
    return person.person_uid === selected;
  }, [person, selected]);

  const report_status: ReportStatus = useMemo(() => {
    if (!person) return;

    const report = reports.find(
      (record) =>
        record.report_data.report_date === currentMonth &&
        record.report_data.person_uid === person.person_uid
    );

    if (!report) return 'not_received';

    if (!report.report_data.shared_ministry) return 'not_received';

    return report.report_data.status;
  }, [reports, person, currentMonth]);

  const handleToggleSelect = () => {
    setSelected((prev) => {
      if (prev && prev === person.person_uid) return undefined;

      return person.person_uid;
    });
  };

  return {
    report_status,
    isSelected,
    handleToggleSelect,
    currentMonth,
  };
};

export default usePersonItem;
