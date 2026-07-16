import { MouseEvent } from 'react';
import { BibleStudyItemProps } from './index.types';

const useBibleStudyItem = ({ bibleStudy, onEdit, onToggle }: BibleStudyItemProps) => {
  const handleEditStudy = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onEdit(bibleStudy);
  };

  const handleToggleStudy = (e: MouseEvent<HTMLLIElement>) => {
    e.currentTarget.blur();
    onToggle(bibleStudy);
  };

  return { handleEditStudy, handleToggleStudy };
};

export default useBibleStudyItem;
