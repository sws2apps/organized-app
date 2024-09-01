import { useMemo, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  bibleStudyEditorOpenState,
  currentBibleStudyState,
  userBibleStudiesState,
} from '@states/user_bible_studies';

const useBibleSelector = () => {
  const setEditorOpen = useSetRecoilState(bibleStudyEditorOpenState);
  const setBibleStudy = useSetRecoilState(currentBibleStudyState);

  const bibleStudiesAll = useRecoilValue(userBibleStudiesState);

  const [selectorOpen, setSelectorOpen] = useState(false);

  const bibleStudies = useMemo(() => {
    return bibleStudiesAll.filter(
      (record) => record.person_data._deleted === false
    );
  }, [bibleStudiesAll]);

  const handleAddNewBibleStudy = () => {
    setSelectorOpen(false);
    setBibleStudy(undefined);
    setEditorOpen(true);
  };

  const handleToggleSelector = () => {
    if (bibleStudies.length > 0) {
      setSelectorOpen((prev) => !prev);
      return;
    }

    handleAddNewBibleStudy();
  };

  return {
    selectorOpen,
    handleToggleSelector,
    handleAddNewBibleStudy,
    bibleStudies,
  };
};

export default useBibleSelector;
