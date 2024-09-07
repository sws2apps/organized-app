import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { congSpecialMonthsState } from '@states/settings';
import { SpecialMonthType } from '@definition/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';

const useSpecialMonths = () => {
  const specialMonths = useRecoilValue(congSpecialMonthsState);

  const [months, setMonths] = useState(specialMonths);

  const handleAddRecord = () => {
    const obj: SpecialMonthType = {
      id: crypto.randomUUID(),
      _deleted: false,
      month_start: null,
      month_end: null,
      updatedAt: '',
    };

    setMonths((prev) => {
      const newMonths = structuredClone(prev);
      newMonths.push(obj);

      return newMonths;
    });
  };

  const handleDelete = async (id: string) => {
    const newList = structuredClone(specialMonths);
    const foundMonth = newList.find((record) => record.id === id);

    if (foundMonth) {
      foundMonth._deleted = true;
      foundMonth.updatedAt = new Date().toISOString();

      await dbAppSettingsUpdate({ 'cong_settings.special_months': newList });
    }

    if (!foundMonth) {
      const tmpList = months.filter((record) => record.id !== id);
      setMonths(tmpList);
    }
  };

  useEffect(() => {
    setMonths(specialMonths);
  }, [specialMonths]);

  return { months, handleAddRecord, handleDelete };
};

export default useSpecialMonths;
