import {
  IconFolderFav,
  IconInformationBoard,
  IconNotifications,
  IconSourceMaterial,
} from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { selectedCategory } from '@states/information_board';
import { convertStringToBoolean } from '@utils/common';
import { useAtom } from 'jotai';
import { useState } from 'react';

const useCategorySelector = () => {
  const { t } = useAppTranslation();

  const categories = [
    {
      icon: <IconInformationBoard />,
      title: t('tr_generalInformation'),
      key: 'general_information',
    },
    {
      icon: <IconNotifications />,
      title: t('tr_localAnnouncements'),
      key: 'local_announcments',
    },
    {
      icon: <IconSourceMaterial />,
      title: t('tr_branchLetters'),
      key: 'branch_letters',
    },
    {
      icon: <IconFolderFav />,
      title: t('tr_frequentlyUsedIformation'),
      key: 'frequently_used_information',
    },
  ];

  const [activeCategory, setActiveCategory] = useAtom(selectedCategory);

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

  const handleToggleActiveCategory = (category: string) => {
    setActiveCategory(category);
  };

  return {
    isCategoriesCollapsed,
    handleToggleCollapsedCategories,
    activeCategory,
    handleToggleActiveCategory,
    categories,
  };
};

export default useCategorySelector;
