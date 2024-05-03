import { useEffect, useState } from 'react';
import { useListType } from './index.types';

const useList = ({ cong_number, currentExpanded, onChangeCurrentExpanded }: useListType) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isExpanded, setIsExpanded] = useState(currentExpanded === cong_number);

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

    if (currentExpanded === cong_number) {
      onChangeCurrentExpanded('');
    } else {
      onChangeCurrentExpanded(cong_number);
    }
  };

  useEffect(() => {
    setIsExpanded(currentExpanded === cong_number);
  }, [currentExpanded, cong_number]);

  return { isEditMode, handleToggleEdit, isExpanded, handleToggleExpanded };
};

export default useList;
