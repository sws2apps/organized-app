import { MouseEvent } from 'react';
import { BibleStudyItemProps } from './index.types';

const useBibleStudyItem = ({
  bibleStudy,
  onEdit,
  onSelect,
}: BibleStudyItemProps) => {
  const handleEditStudy = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onEdit(bibleStudy);
  };

  const handleSelectStudy = (e: MouseEvent<HTMLLIElement>) => {
    e.currentTarget.blur();
    onSelect(bibleStudy);
  };

  return { handleEditStudy, handleSelectStudy };
};

export default useBibleStudyItem;
