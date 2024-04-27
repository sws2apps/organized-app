// ** FOR SETTING STATE OUTSIDE REACT COMPONENTS OR TO AVOID USE OF USECALLBACK ** //

import { promiseSetRecoil } from 'recoil-outside';
import { isDeleteDbOpenState } from '@states/app';

export const setIsDeleteDbOpen = async (value) => {
  await promiseSetRecoil(isDeleteDbOpenState, value);
};
