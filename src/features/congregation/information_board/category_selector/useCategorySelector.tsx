import {
  IconFolderFav,
  IconInformationBoard,
  IconNotifications,
  IconSourceMaterial,
} from '@components/icons';
import { InformationBoardCategory } from '@definition/information_board';
import { useAppTranslation } from '@hooks/index';
import {
  infoBoardAnnouncementsState,
  infoBoardSelectedCategory,
} from '@states/information_board';
import { convertStringToBoolean } from '@utils/common';
import { useAtom, useAtomValue } from 'jotai';
import { useMemo, useState } from 'react';

const useCategorySelector = () => {
  const { t } = useAppTranslation();
  const announcements = useAtomValue(infoBoardAnnouncementsState);

  const categories = useMemo(() => {
    const grouped = {
      general_information: [],
      local_announcements: [],
      branch_letters: [],
      frequently_used_information: [],
    } as Record<string, typeof announcements>;

    for (const record of announcements) {
      if (record._deleted === true) continue;

      if (record.category) grouped[record.category]?.push(record);
    }

    for (const records of Object.values(grouped)) {
      records.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    }

    return [
      {
        icon: <IconInformationBoard />,
        title: t('tr_generalInformation'),
        key: 'general_information',
        entries: grouped.general_information.map((record) => record.title),
      },
      {
        icon: <IconNotifications />,
        title: t('tr_localAnnouncements'),
        key: 'local_announcements',
        entries: grouped.local_announcements.map((record) => record.title),
      },
      {
        icon: <IconSourceMaterial />,
        title: t('tr_branchLetters'),
        key: 'branch_letters',
        entries: grouped.branch_letters.map((record) => record.title),
      },
      {
        icon: <IconFolderFav />,
        title: t('tr_frequentlyUsedIformation'),
        key: 'frequently_used_information',
        entries: grouped.frequently_used_information.map(
          (record) => record.title
        ),
      },
    ];
  }, [announcements, t]);

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
