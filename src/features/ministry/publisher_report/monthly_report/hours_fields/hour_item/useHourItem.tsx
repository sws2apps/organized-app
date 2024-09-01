import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { AssignmentCode } from '@definition/assignment';
import { reportUserSelectedMonthState } from '@states/user_field_service_reports';
import { congSpecialMonthsState } from '@states/settings';
import { personIsEnrollmentActive } from '@services/app/persons';
import { useCurrentUser } from '@hooks/index';
import { formatDate } from '@services/dateformat';
import useMinistryMonthlyRecord from '@features/ministry/hooks/useMinistryMonthlyRecord';

const useHourItem = () => {
  const { person } = useCurrentUser();

  const currentMonth = useRecoilValue(reportUserSelectedMonthState);
  const specialMonths = useRecoilValue(congSpecialMonthsState);

  const {
    hours,
    minutes_remains,
    approved_assignments_included,
    hours_credits_total,
  } = useMinistryMonthlyRecord(currentMonth);

  const goal = useMemo(() => {
    let value: number;

    const isAP = personIsEnrollmentActive(person, 'AP', currentMonth);
    const isFR = personIsEnrollmentActive(person, 'FR', currentMonth);

    if (isAP) {
      // check for allowed 15h later
      const monthDate = `${currentMonth}/01`;
      const isSpecial = specialMonths.find(
        (record) =>
          monthDate >= record.month_start && monthDate < record.month_end
      );

      value = isSpecial ? 15 : 30;
    }

    if (isFR) {
      value = 50;
    }

    return value;
  }, [person, currentMonth, specialMonths]);

  const total_hours = useMemo(() => {
    const tHours = hours + hours_credits_total + approved_assignments_included;

    return `${tHours}:${String(minutes_remains).padStart(2, '0')}`;
  }, [
    hours,
    minutes_remains,
    hours_credits_total,
    approved_assignments_included,
  ]);

  const eventsEnabled = useMemo(() => {
    const event = person.person_data.pioneer_events.find((record) => {
      if (record._deleted) return false;

      const startMonth = formatDate(new Date(record.start_date), 'yyyy/MM');
      const endMonth = formatDate(new Date(record.end_date), 'yyyy/MM');

      return currentMonth >= startMonth && currentMonth <= endMonth;
    });

    return event ? true : false;
  }, [person, currentMonth]);

  const reportHoursCredit = useMemo(() => {
    const assignments = person.person_data.assignments.filter(
      (record) => record._deleted === false
    );

    return assignments.find(
      (record) => record.code === AssignmentCode.MINISTRY_HOURS_CREDIT
    );
  }, [person]);

  const hoursCreditEnabled = useMemo(() => {
    return reportHoursCredit || eventsEnabled;
  }, [reportHoursCredit, eventsEnabled]);

  return { goal, total_hours, hoursCreditEnabled };
};

export default useHourItem;
