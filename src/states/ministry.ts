import { atom } from 'recoil';
import { APFormType } from '@definition/ministry';

export const currentAPFormState = atom<APFormType>({
  key: 'currentAPForm',
  default: {
    months: [],
    continuous: false,
    date: new Date(),
    name: '',
  },
});
