/*
This file holds the source of the truth from the table "assignment".
*/

import { atom, selector } from 'recoil';
import {
  AssignmentAYFOnlyType,
  AssignmentLocalType,
  AssignmentType,
} from '@definition/assignment';
import { JWLangState } from './settings';

export const assignmentState = atom<AssignmentType[]>({
  key: 'assignment',
  default: [],
});

export const assignmentTypeLocaleState = selector({
  key: 'assignmentTypeLocale',
  get: ({ get }) => {
    const assignmentType = get(assignmentState);
    const JWLang: string = get(JWLangState);

    const result: AssignmentLocalType[] = [];
    for (const type of assignmentType) {
      const obj = {} as AssignmentLocalType;
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

export const assignmentTypeAYFOnlyState = selector<AssignmentAYFOnlyType[]>({
  key: 'assignmentTypeAYFOnly',
  get: ({ get }) => {
    const assignmentTypeLocale = get(assignmentTypeLocaleState);

    const newList = assignmentTypeLocale
      .filter(
        (record) =>
          record.type === 'ayf' &&
          record.label !== undefined &&
          record.label !== ''
      )
      .sort((a, b) => {
        return a.value > b.value ? 1 : -1;
      });

    const final = newList.map((list) => {
      return { label: list.label, value: list.value };
    });

    return final;
  },
});
