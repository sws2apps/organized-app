import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { AssignmentCode } from '@definition/assignment';
import { reportUserSelectedMonthState } from '@states/user_field_service_reports';
import { congSpecialMonthsState } from '@states/settings';
import { personIsEnrollmentActive } from '@services/app/persons';
import { useCurrentUser } from '@hooks/index';
import useMinistryMonthlyRecord from '@features/ministry/hooks/useMinistryMonthlyRecord';

const useHourItem = () => {
  const { person } = useCurrentUser();

  const currentMonth = useRecoilValue(reportUserSelectedMonthState);
  const specialMonths = useRecoilValue(congSpecialMonthsState);

  const { hours, minutes_remains, hours_credit } =
    useMinistryMonthlyRecord(currentMonth);

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
    const tHours = hours + hours_credit;

    return `${tHours}:${String(minutes_remains).padStart(2, '0')}`;
  }, [hours, minutes_remains, hours_credit]);

  const hoursCreditEnabled = useMemo(() => {
    const assignments = person.person_data.assignments.filter(
      (record) => record._deleted === false
    );

    return assignments.find(
      (record) => record.code === AssignmentCode.MINISTRY_HOURS_CREDIT
    );
  }, [person]);

  return { goal, total_hours, hoursCreditEnabled };
};

export default useHourItem;
