// ** FOR SETTING STATE OUTSIDE REACT COMPONENTS OR TO AVOID USE OF USECALLBACK ** //

import { store } from '@states/index';
import { isDeleteDbOpenState } from '@states/app';

export const setIsDeleteDbOpen = (value: boolean) => {
  store.set(isDeleteDbOpenState, value);
};
