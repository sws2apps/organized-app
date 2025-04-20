import { atomWithReset } from 'jotai/utils';
import { APFormType } from '@definition/ministry';

export const currentAPFormState = atomWithReset<APFormType>({
  months: [],
  continuous: false,
  date: new Date(),
  name: '',
});
