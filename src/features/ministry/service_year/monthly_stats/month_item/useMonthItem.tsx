import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { MonthItemProps, MonthStatusType } from './index.types';
import { monthNamesState } from '@states/app';
import { currentMonthServiceYear } from '@utils/date';
import { useCurrentUser } from '@hooks/index';
import useMinistryMonthlyRecord from '@features/ministry/hooks/useMinistryMonthlyRecord';
import { personIsEnrollmentActive } from '@services/app/persons';

const useMonthItem = ({ month }: MonthItemProps) => {
  const { person } = useCurrentUser();

  const monthNames = useRecoilValue(monthNamesState);

  const { status, bible_studies, total_hours, comments } =
    useMinistryMonthlyRecord(month);

  const monthname = useMemo(() => {
    const monthIndex = +month.split('/')[1] - 1;
    return monthNames[monthIndex];
  }, [month, monthNames]);

  const isCurrent = useMemo(() => {
    const current = currentMonthServiceYear();

    return month === current;
  }, [month]);

  const monthStatus: MonthStatusType = useMemo(() => {
    if (status !== 'pending') return status;

    const currentMonth = currentMonthServiceYear();

    if (month >= currentMonth) return status;

    return 'late';
  }, [status, month]);

  const isAP = useMemo(() => {
    return personIsEnrollmentActive(person, 'AP', month);
  }, [person, month]);

  const isFR = useMemo(() => {
    return personIsEnrollmentActive(person, 'FR', month);
  }, [person, month]);

  return {
    monthname,
    monthStatus,
    bible_studies,
    total_hours,
    isAP,
    comments,
    isFR,
    isCurrent,
  };
};

export default useMonthItem;
