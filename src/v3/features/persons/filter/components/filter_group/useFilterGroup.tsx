import { useRecoilValue } from 'recoil';
import { personsFiltersKeyState } from '@states/persons';
import { setPersonsFiltersKey } from '@services/recoil/persons';

const useFilterGroup = () => {
  const filtersKey = useRecoilValue(personsFiltersKeyState);

  const handleClick = async (key) => {
    const hasKey = filtersKey.find((activeKey) => activeKey === key);
    let newFiltersKey = [];

    if (hasKey) {
      newFiltersKey = filtersKey.filter((activeKey) => activeKey !== key);
    }

    if (!hasKey) {
      newFiltersKey = [...filtersKey, key];
    }

    await setPersonsFiltersKey(newFiltersKey);
  };

  return { filtersKey, handleClick };
};

export default useFilterGroup;
