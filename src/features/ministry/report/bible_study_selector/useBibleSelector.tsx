import { useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { UserBibleStudyType } from '@definition/user_bible_studies';
import { userBibleStudiesState } from '@states/user_bible_studies';
import { BibleStudySelectorProps } from './index.types';

const useBibleSelector = ({ onChange }: BibleStudySelectorProps) => {
  const bibleStudiesAll = useRecoilValue(userBibleStudiesState);

  const [selectorOpen, setSelectorOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [bibleStudy, setBibleStudy] = useState<UserBibleStudyType>(undefined);

  const bibleStudies = useMemo(() => {
    return bibleStudiesAll.filter(
      (record) => record.person_data._deleted === false
    );
  }, [bibleStudiesAll]);

  const handleCloseEditor = () => setEditorOpen(false);

  const handleEditBibleStudy = (study: UserBibleStudyType) => {
    setBibleStudy(study);
    setSelectorOpen(false);
    setEditorOpen(true);
  };

  const handleAddNewBibleStudy = () => {
    setSelectorOpen(false);
    setEditorOpen(true);
  };

  const handleToggleSelector = () => {
    if (bibleStudies.length > 0) {
      setSelectorOpen((prev) => !prev);
      return;
    }

    handleAddNewBibleStudy();
  };

  const handleSelectBibleStudy = (study: UserBibleStudyType) => {
    setSelectorOpen(false);
    onChange(study);
  };

  return {
    editorOpen,
    selectorOpen,
    handleToggleSelector,
    handleAddNewBibleStudy,
    bibleStudies,
    handleCloseEditor,
    bibleStudy,
    handleEditBibleStudy,
    handleSelectBibleStudy,
  };
};

export default useBibleSelector;
