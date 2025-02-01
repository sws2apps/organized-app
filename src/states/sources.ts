/*
This file holds the source of the truth from the table "sources".
*/

import { atom, selector } from 'recoil';
import { SourceWeekType, SourcesFormattedType } from '@definition/sources';
import { isMondayDate } from '@utils/date';

export const sourcesState = atom<SourceWeekType[]>({
  key: 'sources',
  default: [],
});

export const sourcesValidState = selector({
  key: 'sourcesValid',
  get: ({ get }) => {
    const sources = get(sourcesState);

    // remove invalid weeks
    const newSources = sources.filter((record) => isMondayDate(record.weekOf));

    return newSources.sort((a, b) => a.weekOf.localeCompare(b.weekOf));
  },
});

export const sourcesFormattedState = selector({
  key: 'sourcesFormatted',
  get: ({ get }) => {
    const sources = get(sourcesState);

    // remove invalid weeks
    const newSources = sources.filter((record) => isMondayDate(record.weekOf));

    // First, sort the data in ascending order by date
    newSources.sort(
      (a, b) => new Date(a.weekOf).getTime() - new Date(b.weekOf).getTime()
    );

    // Then, group the data by year and month
    const groupedData = newSources.reduce<SourcesFormattedType[]>(
      (acc, curr) => {
        const date = new Date(curr.weekOf);
        const year = date.getFullYear();
        const month = date.getMonth();

        // Initialize year object if not already present
        const findYear = acc.find((record) => record.value === year);
        if (!findYear) {
          acc.push({ value: year, months: [] });
        }

        // Initialize month array if not already present
        const yearRecord = acc.find((record) => record.value === year);
        const findMonth = yearRecord.months.find(
          (record) => record.value === month
        );
        if (!findMonth) {
          yearRecord.months.push({ value: month, weeks: [] });
        }

        // Add current week to the appropriate month array
        const monthRecord = yearRecord.months.find(
          (record) => record.value === month
        );
        monthRecord.weeks.push(curr.weekOf);

        return acc;
      },
      []
    );

    // Finally, sort the months in descending order for each year
    for (const year in groupedData) {
      groupedData[year].months.sort((a, b) => b.value - a.value);
    }

    return groupedData;
  },
});

export const epubFileState = atom<File>({
  key: 'epubFile',
  default: null,
});

export const isImportJWOrgState = atom({
  key: 'isImportJWOrg',
  default: false,
});

export const isImportEPUBState = atom({
  key: 'isImportEPUB',
  default: false,
});

export const currentWeekState = atom({
  key: 'currentWeek',
  default: '',
});
