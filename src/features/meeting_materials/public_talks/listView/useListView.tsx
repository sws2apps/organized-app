import { useAppTranslation } from '@hooks/index';
import { Column } from '@components/table/index.types';
import { TalksListViewType } from './index.types';
import { TalkItemType } from '../index.types';
import useSorting from '@components/table/useSorting';

const useListView = (talks: TalksListViewType['talks']) => {
  const { t } = useAppTranslation();

  const tableColumns: Column[] = [
    {
      id: 'talk_number',
      label: t('tr_shortNumberLabel'),
      sx: { width: '30px', backgroundColor: 'unset' },
    },
    {
      id: 'talk_title',
      label: t('tr_title'),
      sx: { minWidth: '120px', backgroundColor: 'unset' },
    },
    {
      id: 'last_date',
      label: t('tr_date'),
      sx: { width: '60px', backgroundColor: 'unset' },
    },
    {
      id: 'last_speaker',
      label: t('tr_speaker'),
      sx: { width: '188px', backgroundColor: 'unset' },
    },
    {
      id: 'history_expand',
      label: '',
      sx: { width: '24px', backgroundColor: 'unset' },
    },
  ];

  const { order, orderBy, handleRequestSort, visibleRows } = useSorting({
    initialOrder: 'asc',
    initialOrderBy: 'id',
    rows: talks as unknown as { [key: string]: string | number }[],
  });

  return {
    talksList: visibleRows as unknown as TalkItemType[],
    tableColumns,
    order,
    orderBy,
    handleRequestSort,
  };
};

export default useListView;
