import { useRecoilValue } from 'recoil';
import { publicTalksFilteredState } from '@states/publicTalks';
import { useAppTranslation } from '@hooks/index';
import useSorting from '@components/table/useSorting';
import { Column } from '@components/table/index.types';

const useListView = () => {
  const { t } = useAppTranslation();

  const tableColumns: Column[] = [
    { id: 'talk_number', label: t('tr_shortNumberLabel'), sx: { width: '30px', backgroundColor: 'unset' } },
    { id: 'talk_title', label: t('tr_title'), sx: { minWidth: '120px', backgroundColor: 'unset' } },
    { id: 'talk_date', label: t('tr_date'), sx: { width: '60px', backgroundColor: 'unset' } },
    { id: 'talk_speaker', label: t('tr_speaker'), sx: { width: '188px', backgroundColor: 'unset' } },
    { id: 'history_expand', label: '', sx: { width: '24px', backgroundColor: 'unset' } },
  ];

  const talksList = useRecoilValue(publicTalksFilteredState);

  const { order, orderBy, handleRequestSort, visibleRows } = useSorting({
    initialOrder: 'asc',
    initialOrderBy: 'id',
    rows: talksList,
  });

  return { talksList: visibleRows, tableColumns, order, orderBy, handleRequestSort };
};

export default useListView;
