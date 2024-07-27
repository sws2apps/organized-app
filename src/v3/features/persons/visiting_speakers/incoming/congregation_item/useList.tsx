import { useEffect, useState } from 'react';
import { useListType } from './index.types';
import { dbSpeakersCongregationsUpdate } from '@services/dexie/speakers_congregations';

const useList = ({
  id,
  currentExpanded,
  onChangeCurrentExpanded,
}: useListType) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isExpanded, setIsExpanded] = useState(currentExpanded === id);

  const handleToggleEdit = () => {
    setIsEditMode((prev) => {
      if (!prev) {
        setIsExpanded((prev) => {
          if (!prev) return !prev;
          return prev;
        });
      }
      return !prev;
    });
  };

  const handleToggleExpanded = () => {
    setIsExpanded((prev) => !prev);

    if (currentExpanded === id) {
      onChangeCurrentExpanded('');
    } else {
      onChangeCurrentExpanded(id);
    }
  };

  const handleDeleteCongregation = async () => {
    await dbSpeakersCongregationsUpdate(
      { _deleted: { value: true, updatedAt: new Date().toISOString() } },
      id
    );
  };

  useEffect(() => {
    setIsExpanded(currentExpanded === id);
  }, [currentExpanded, id]);

  return {
    isEditMode,
    handleToggleEdit,
    isExpanded,
    handleToggleExpanded,
    handleDeleteCongregation,
  };
};

export default useList;
