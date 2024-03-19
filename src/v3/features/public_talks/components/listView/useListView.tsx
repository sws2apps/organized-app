import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { publicTalksLocaleState } from '@states/publicTalks';

const useListView = (txtSearch: string) => {
  const talksList = useRecoilValue(publicTalksLocaleState);

  const [filteredList, setFilteredList] = useState(talksList);

  useEffect(() => {
    const filteredList = talksList.filter(
      (talk) => talk.talk_title.toLowerCase().indexOf(txtSearch.toLowerCase()) !== -1
    );
    setFilteredList(filteredList);
  }, [txtSearch, talksList]);

  return { talksList: filteredList };
};

export default useListView;
