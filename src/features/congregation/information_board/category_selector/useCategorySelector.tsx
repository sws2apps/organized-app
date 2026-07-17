import { convertStringToBoolean } from '@utils/common';
import { useState } from 'react';

const useCategorySelector = () => {
  const [isCategoriesCollapsed, setIsCategoriesCollapsed] = useState(
    convertStringToBoolean(
      localStorage.getItem('information_board_is_categories_collapsed')
    )
  );

  const handleToggleCollapsedCategories = () => {
    setIsCategoriesCollapsed((prev) => {
      localStorage.setItem(
        'information_board_is_categories_collapsed',
        !prev ? 'true' : 'false'
      );
      return !prev;
    });
  };

  return {
    isCategoriesCollapsed,
    handleToggleCollapsedCategories,
  };
};

export default useCategorySelector;
