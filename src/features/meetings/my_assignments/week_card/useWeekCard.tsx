import { useMemo } from 'react';
import { useAppTranslation } from '@hooks/index';
import { addDays, formatDate, getWeekDate } from '@utils/date';
import { AssignmentsWeek } from '../indextypes';

const useWeekCard = (week: AssignmentsWeek) => {
  const { t } = useAppTranslation();

  // only the two nearest weeks are labelled; later ones read by date
  const { label, isCurrent } = useMemo(() => {
    const currentWeek = formatDate(getWeekDate(), 'yyyy/MM/dd');
    const nextWeek = formatDate(addDays(currentWeek, 7), 'yyyy/MM/dd');

    if (week.weekOf === currentWeek) {
      return { label: t('tr_thisWeek'), isCurrent: true };
    }

    if (week.weekOf === nextWeek) {
      return { label: t('tr_nextWeek'), isCurrent: false };
    }

    return { label: '', isCurrent: false };
  }, [week.weekOf, t]);

  return { label, isCurrent };
};

export default useWeekCard;
