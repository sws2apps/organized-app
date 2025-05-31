/*
This file holds the source of the truth from the table "week_type".
*/

import { atom } from 'jotai';
import { WeekType, WeekTypeLocale } from '@definition/week_type';
import { JWLangState, userDataViewState } from './settings';

export const weekTypeState = atom<WeekType[]>([]);

export const weekTypeLocaleState = atom((get) => {
  const sourceLang = get(JWLangState);
  const list = get(weekTypeState);
  const dataView = get(userDataViewState);

  const filteredList = list.filter((type) => {
    if (dataView === 'main' && type.language_group) return false;

    return true;
  });

  const newList: WeekTypeLocale[] = [];

  for (const weekType of filteredList) {
    const obj = {} as WeekTypeLocale;
    obj.id = weekType.id;
    obj.sort_index = weekType.sort_index;
    obj.meeting = weekType.meeting;
    obj.language_group = weekType.language_group;
    obj.week_type_name = weekType.week_type_name[sourceLang.toUpperCase()];
    newList.push(obj);
  }

  newList.sort((a, b) => {
    return a.sort_index > b.sort_index ? 1 : -1;
  });

  return newList;
});
