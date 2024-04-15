import { promiseSetRecoil } from 'recoil-outside';
import { isAddSYOpenState } from '@states/serviceYear';

export const setIsAddSY = async (value) => {
  await promiseSetRecoil(isAddSYOpenState, value);
};
