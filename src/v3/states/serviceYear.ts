/*
This file holds the source of the truth from the table "serviceYear".
*/

import { atom } from 'recoil';

export const serviceYearState = atom({
  key: 'serviceYear',
  default: [],
});

export const isAddSYOpenState = atom({
  key: 'isAddSYOpen',
  default: false,
});
