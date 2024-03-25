/*
This file holds the source of the truth from the table "week_type".
*/

import { atom, selector } from 'recoil';
import { WeekType } from '@definition/sources';
import { appLangState } from './app';

export const weekTypeState = atom({
  key: 'weekType',
  default: [],
});

export const weekTypeLocaleState = selector({
  key: 'weekTypeLocale',
  get: ({ get }) => {
    const appLang = get(appLangState);
    const list = get(weekTypeState);

    const newList: WeekType[] = [];

    for (const weekType of list) {
      const obj = <WeekType>{};
      obj.value = weekType.id_week_type;
      obj.sort_index = weekType.sort_index;
      obj.label = weekType.week_type_name[appLang.toUpperCase()];
      newList.push(obj);
    }

    newList.sort((a, b) => {
      return a.sort_index > b.sort_index ? 1 : -1;
    });

    return newList;
  },
});
