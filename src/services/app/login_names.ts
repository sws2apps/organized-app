import { UserLoginResponseType } from '@definition/api';
import {
  dbAppSettingsGet,
  dbAppSettingsUpdate,
} from '@services/dexie/settings';
import { loginMiddleName } from '@utils/login_names';

export const restoreLoginMiddleName = async (
  response: UserLoginResponseType
) => {
  const local = await dbAppSettingsGet();
  if (!local) throw new Error('Settings not found');
  await dbAppSettingsUpdate({
    'user_settings.middlename': loginMiddleName(
      local,
      response,
      new Date().toISOString()
    ),
    ...(response.id
      ? { 'user_settings.id': response.id }
      : { 'user_settings.id': undefined }),
  });
};
