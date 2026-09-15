// ** FOR SETTING STATE OUTSIDE REACT COMPONENTS OR TO AVOID USE OF USECALLBACK ** //

import { store } from '@states/index';
import { isDeleteDbOpenState } from '@states/app';
import { settingSchema } from '@services/dexie/schema';

export const setIsDeleteDbOpen = (value: boolean) => {
  store.set(isDeleteDbOpenState, value);
};

export const withCongSettingsDefaults = (
  local?: Partial<(typeof settingSchema)['cong_settings']>
) => ({
  ...structuredClone(settingSchema.cong_settings),
  ...local,
});
