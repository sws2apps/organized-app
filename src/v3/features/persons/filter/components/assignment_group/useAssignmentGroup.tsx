import { useRecoilValue } from 'recoil';
import { personsFiltersKeyState } from '@states/persons';
import { setPersonsFiltersKey } from '@services/recoil/persons';

const useAssignmentGroup = () => {
  const filtersKey = useRecoilValue(personsFiltersKeyState);

  const handleToggleAssignment = async (key) => {
    let newFiltersKey = [];
    const hasKey = filtersKey.find((activeKey) => activeKey === key);

    if (hasKey) {
      newFiltersKey = filtersKey.filter((activeKey) => activeKey !== key);
    }

    if (!hasKey) {
      newFiltersKey = [...filtersKey, key];
    }

    await setPersonsFiltersKey(newFiltersKey);
  };

  return { filtersKey, handleToggleAssignment };
};

export default useAssignmentGroup;
