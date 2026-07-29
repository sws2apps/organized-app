import {
  IconFolderFav,
  IconInformationBoard,
  IconNotifications,
  IconSourceMaterial,
} from '@components/icons';
import { InformationBoardCategory } from '@definition/information_board';
import { useAppTranslation } from '@hooks/index';
import { infoBoardSelectedCategory } from '@states/information_board';
import { convertStringToBoolean } from '@utils/common';
import { useAtom } from 'jotai';
import { useMemo, useState } from 'react';

const useCategorySelector = () => {
  const { t } = useAppTranslation();

  const categories = useMemo(
    () => [
      {
        icon: <IconInformationBoard />,
        title: t('tr_generalInformation'),
        key: 'general_information',
      },
      {
        icon: <IconNotifications />,
        title: t('tr_localAnnouncements'),
        key: 'local_announcements',
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
    ],
    [t]
  );

  const [activeCategory, setActiveCategory] = useAtom(
    infoBoardSelectedCategory
  );

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

  const handleChangeActiveCategory = (category: InformationBoardCategory) => {
    setActiveCategory(category);
  };

  return {
    isCategoriesCollapsed,
    handleToggleCollapsedCategories,
    activeCategory,
    handleChangeActiveCategory,
    categories,
  };
};

export default useCategorySelector;
