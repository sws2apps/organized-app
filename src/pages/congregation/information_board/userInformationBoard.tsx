import { InformationBoardCategory } from '@definition/information_board';
import GeneralInformation from '@features/congregation/information_board/general_information';
import { selectedCategory } from '@states/information_board';
import { useAtomValue } from 'jotai';
import { ReactNode } from 'react';

const useInformationBoard = () => {
  const activeCategory = useAtomValue(selectedCategory);

  const categoriesPages: Record<InformationBoardCategory, ReactNode> = {
    general_information: <GeneralInformation />,
    local_announcments: null,
    branch_letters: null,
    frequently_used_information: null,
  };

  const currentCategory = categoriesPages[activeCategory];

  return { currentCategory };
};

export default useInformationBoard;
