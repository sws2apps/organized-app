import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import {
  congFieldServiceReportsState,
  selectedMonthFieldServiceReportState,
} from '@states/field_service_reports';
import useCurrentUser from '@hooks/useCurrentUser';
import usePersons from '@features/persons/hooks/usePersons';
import { userDataViewState } from '@states/settings';
import { languageGroupsState } from '@states/field_service_groups';

const useReceivedReports = () => {
  const { isSecretary, isGroupOverseer, my_group, isGroupAdmin } =
    useCurrentUser();

  const { getPublishersActive } = usePersons();

  const currentMonth = useAtomValue(selectedMonthFieldServiceReportState);
  const reports = useAtomValue(congFieldServiceReportsState);
  const dataView = useAtomValue(userDataViewState);
  const languageGroups = useAtomValue(languageGroupsState);

  const publishers = useMemo(() => {
    const data = getPublishersActive(currentMonth);

    if (isGroupAdmin) {
      return data.filter((record) => {
        const group = languageGroups.find((g) => g.group_id === dataView);

        if (!group) return true;

        return group.group_data.members.some(
          (m) => m.person_uid === record.person_uid
        );
      });
    }

    if (!isSecretary && isGroupOverseer) {
      const members = my_group.group_data.members.filter((member) => {
        const isActive = data.find(
          (record) => record.person_uid === member.person_uid
        );

        return isActive;
      });

      return data.filter((record) =>
        members.some((m) => m.person_uid === record.person_uid)
      );
    }

    return data;
  }, [
    currentMonth,
    dataView,
    getPublishersActive,
    isGroupAdmin,
    isGroupOverseer,
    isSecretary,
    my_group,
    languageGroups,
  ]);

  const publishers_active = useMemo(() => {
    return publishers.length;
  }, [publishers]);

  const received_reports = useMemo(() => {
    const results = reports.filter(
      (record) =>
        record.report_data.report_date === currentMonth &&
        record.report_data.shared_ministry
    );

    const filtered = results.filter((record) =>
      publishers.some((p) => p.person_uid === record.report_data.person_uid)
    );

    return filtered.length;
  }, [currentMonth, reports, publishers]);

  return { publishers_active, received_reports };
};

export default useReceivedReports;
