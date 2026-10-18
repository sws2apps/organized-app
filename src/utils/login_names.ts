import { UserLoginResponseType } from '@definition/api';
import { SettingsType } from '@definition/settings';

export const loginMiddleName = (
  local: SettingsType,
  response: UserLoginResponseType,
  now: string
) => {
  const remote = response.app_settings.user_settings;
  const sameAccount =
    response.id && local.user_settings.id
      ? response.id === local.user_settings.id
      : Boolean(
          remote.user_local_uid &&
          remote.user_local_uid === local.user_settings.user_local_uid &&
          response.app_settings.cong_settings?.id ===
            local.cong_settings.cong_id
        );
  const personChanged =
    remote.user_local_uid !== undefined &&
    remote.user_local_uid !== local.user_settings.user_local_uid;
  const previous =
    sameAccount && !personChanged ? local.user_settings.middlename : undefined;
  if (!remote.middlename) return previous ?? { value: '', updatedAt: now };
  // An explicit empty field is a clear; it participates in normal timestamp ordering.
  return previous && previous.updatedAt > remote.middlename.updatedAt
    ? previous
    : remote.middlename;
};
