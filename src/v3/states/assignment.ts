/*
This file holds the source of the truth from the table "assignment".
*/

import { atom, selector } from 'recoil';
import { AssignmentType } from '@definition/sources';
import { JWLangState } from './app';

export const assignmentState = atom({
  key: 'assignment',
  default: [],
});

export const assignmentTypeLocaleState = selector({
  key: 'assignmentTypeLocale',
  get: ({ get }) => {
    const assignmentType = get(assignmentState);
    const JWLang: string = get(JWLangState);

    const result: AssignmentType[] = [];
    for (const type of assignmentType) {
      const obj = <AssignmentType>{};
      obj.value = type.code;
      obj.label = type.assignment_type_name[JWLang.toUpperCase()];
      obj.assignable = type.assignable;
      obj.maleOnly = type.maleOnly;
      obj.type = type.type;
      obj.linkTo = type.linkTo;
      result.push(obj);
    }

    return result;
  },
});

export const assignmentTypeAYFOnlyState = selector({
  key: 'assignmentTypeAYFOnly',
  get: ({ get }) => {
    const assignmentTypeLocale = get(assignmentTypeLocaleState);

    const newList = assignmentTypeLocale
      .filter((ass) => ass.type === 'ayf' && ass.label !== undefined && ass.label !== '')
      .sort((a, b) => {
        return a.value > b.value ? 1 : -1;
      });

    const final = newList.map((list) => {
      return { label: list.label, value: list.value };
    });

    return final;
  },
});
