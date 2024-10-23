import { useRecoilState } from 'recoil';
import { personsFiltersKeyState } from '@states/persons';

const useFilterGroup = () => {
  const [filtersKey, setPersonsFiltersKey] = useRecoilState(
    personsFiltersKeyState
  );

  const handleClick = (key) => {
    const hasKey = filtersKey.find((activeKey) => activeKey === key);
    let newFiltersKey = [];

    if (hasKey) {
      newFiltersKey = filtersKey.filter((activeKey) => activeKey !== key);
    }

    if (!hasKey) {
      newFiltersKey = [...filtersKey, key];

      const specialKeys = [
        { keys: ['male', 'female'] },
        { keys: ['baptized', 'unbaptized'] },
        { keys: ['active', 'inactive'] },
        { keys: ['pioneerAll', 'AP', 'FR', 'FS', 'FMF'] },
        { keys: ['appointedBrotherAll', 'elder', 'ministerialServant'] },
      ];

      const sKeys = specialKeys.find((record) => record.keys.includes(key));

      if (sKeys) {
        const keyRemove = sKeys.keys.filter((record) => record !== key);
        newFiltersKey = newFiltersKey.filter(
          (record) => !keyRemove.includes(record)
        );
      }
    }

    setPersonsFiltersKey(newFiltersKey);
  };

  return { filtersKey, handleClick };
};

export default useFilterGroup;
