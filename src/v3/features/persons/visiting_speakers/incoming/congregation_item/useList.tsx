import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { visitingSpeakersState } from '@states/visiting_speakers';
import { useListType } from './index.types';

const useList = ({ cong_number, currentExpanded, onChangeCurrentExpanded }: useListType) => {
  const visitingSpeakers = useRecoilValue(visitingSpeakersState);

  const [isEditMode, setIsEditMode] = useState(false);
  const [isExpanded, setIsExpanded] = useState(currentExpanded === cong_number);

  const speakers = visitingSpeakers.filter((record) => record.cong_number === cong_number);

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

  return { isEditMode, handleToggleEdit, speakers, isExpanded, handleToggleExpanded };
};

export default useList;
