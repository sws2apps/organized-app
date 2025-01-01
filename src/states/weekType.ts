/*
This file holds the source of the truth from the table "week_type".
*/

import { atom, selector } from 'recoil';
import { WeekType, WeekTypeLocale } from '@definition/week_type';
import { JWLangLocaleState } from './settings';

export const weekTypeState = atom<WeekType[]>({
  key: 'weekType',
  default: [],
});

export const weekTypeLocaleState = selector({
  key: 'weekTypeLocale',
  get: ({ get }) => {
    const sourceLocale = get(JWLangLocaleState);
    const list = get(weekTypeState);

    const newList: WeekTypeLocale[] = [];

    for (const weekType of list) {
      const obj = {} as WeekTypeLocale;
      obj.id = weekType.id;
      obj.sort_index = weekType.sort_index;
      obj.meeting = weekType.meeting;
      obj.week_type_name = weekType.week_type_name[sourceLocale.toUpperCase()];
      newList.push(obj);
    }

    newList.sort((a, b) => {
      return a.sort_index > b.sort_index ? 1 : -1;
    });

    return newList;
  },
});
