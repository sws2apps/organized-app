import { Column } from '@components/table/index.types';
import useSorting, { UseSortingProps } from '@components/table/useSorting';
import { AssignmentHistoryType } from '@definition/schedules';
import { useAppTranslation } from '@hooks/index';
import { FormattedHistoryType } from './index.types';

const useAssignmentsHistory = (history: AssignmentHistoryType[]) => {
  const { t } = useAppTranslation();

  const tableColumns: Column[] = [
    {
      id: 'history_date',
      label: t('tr_date'),
      sx: { width: '104px', backgroundColor: 'unset' },
    },
    {
      id: 'history_assignment',
      label: t('tr_assignment'),
      sx: { minWidth: '310px', backgroundColor: 'unset' },
    },
    {
      id: 'history_hall',
      label: t('tr_hall'),
      sx: { width: '80px', backgroundColor: 'unset', textAlign: 'center' },
    },
  ];

  const customHistory = history.map((record) => {
    return {
      history_id: record.id,
      history_date: record.weekOf,
      history_assignment: record.assignment.title,
      history_hall: record.assignment.classroom,
      history_misc: record.assignment,
    };
  });

  const { order, orderBy, handleRequestSort, visibleRows } = useSorting({
    initialOrder: 'asc',
    initialOrderBy: 'id',
    rows: customHistory as unknown as UseSortingProps['rows'],
  });

  return {
    assignments: visibleRows as unknown as FormattedHistoryType[],
    tableColumns,
    order,
    orderBy,
    handleRequestSort,
  };
};

export default useAssignmentsHistory;
