import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import {
  congFieldServiceReportsState,
  selectedMonthFieldServiceReportState,
} from '@states/field_service_reports';
import useCurrentUser from '@hooks/useCurrentUser';
import usePersons from '@features/persons/hooks/usePersons';

const useReceivedReports = () => {
  const { isSecretary, isGroupOverseer, my_group } = useCurrentUser();

  const { getPublishersActive } = usePersons();

  const currentMonth = useRecoilValue(selectedMonthFieldServiceReportState);
  const reports = useRecoilValue(congFieldServiceReportsState);

  const publishers_active = useMemo(() => {
    const data = getPublishersActive(currentMonth);

    if (isSecretary) {
      return data.length;
    }

    if (!isSecretary && isGroupOverseer) {
      const active_members = my_group.group_data.members.filter((member) => {
        const isActive = data.find(
          (record) => record.person_uid === member.person_uid
        );

        return isActive;
      });

      return active_members.length;
    }
  }, [
    isSecretary,
    isGroupOverseer,
    my_group,
    currentMonth,
    getPublishersActive,
  ]);

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
