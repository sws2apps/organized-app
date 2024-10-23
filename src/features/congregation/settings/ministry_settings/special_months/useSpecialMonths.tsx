import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { YearOptionType } from './index.types';
import { congSpecialMonthsState, settingsState } from '@states/settings';
import { createArrayFromMonths, currentServiceYear } from '@utils/date';
import { monthNamesState } from '@states/app';
import { dbAppSettingsUpdate } from '@services/dexie/settings';

const useSpecialMonths = () => {
  const specialMonths = useRecoilValue(congSpecialMonthsState);
  const monthNames = useRecoilValue(monthNamesState);
  const settings = useRecoilValue(settingsState);

  const yearsList = useMemo(() => {
    const result: YearOptionType[] = [];

    const currentYear = currentServiceYear();
    const previousYear = String(+currentYear - 1);
    const nextYear = String(+currentYear + 1);

    const hasPrevious =
      specialMonths.find((record) => record.year === previousYear)?.months.length > 0;

    const years: string[] = [];

    if (hasPrevious) years.push(previousYear);

    years.push(currentYear, nextYear);

    for (const year of years) {
      const startMonth = String(`${+year - 1}/09`);
      const endMonth = `${year}/08`;

      const months = createArrayFromMonths(startMonth, endMonth).map(
        (month) => {
          const monthIndex = +month.split('/')[1] - 1;
          return { value: month, label: monthNames[monthIndex] };
        }
      );

      const selectedMonths =
        specialMonths.find((record) => record.year === year)?.months || [];

      result.push({
        year,
        months,
        selected: selectedMonths,
      });
    }

    return result;
  }, [specialMonths, monthNames]);

  const handleFormatMonths = (values: string[]) => {
    const months = values
      .toSorted()
      .map((value) => {
        const monthIndex = +value.split('/')[1] - 1;
        const month = monthNames[monthIndex];

        return month;
      })
      .join(', ');

    return months;
  };

  const handleSetMonths = async (year: string, months: string[]) => {
    const specialMonths = structuredClone(
      settings.cong_settings.special_months
    );

    let yearToUpdate = specialMonths.find((record) => record.year === year);

    if (!yearToUpdate) {
      specialMonths.push({ _deleted: false, months: [], updatedAt: '', year });

      yearToUpdate = specialMonths.find((record) => record.year === year);
    }

    yearToUpdate.months = months.toSorted();
    yearToUpdate.updatedAt = new Date().toISOString();
    yearToUpdate._deleted = false;

    await dbAppSettingsUpdate({
      'cong_settings.special_months': specialMonths,
    });
  };

  return { yearsList, handleFormatMonths, handleSetMonths };
};

export default useSpecialMonths;
