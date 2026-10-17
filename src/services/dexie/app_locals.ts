import appDb from '@db/appDb';

export const dbAppLocalsSaveAvatar = async (buffer: ArrayBuffer) => {
  await appDb.app_locals.put({ id: 1, avatar: buffer });
};

export const dbAppLocalsClearAvatar = async () => {
  const record = await appDb.app_locals.get(1);

  if (!record) return;

  await appDb.app_locals.delete(1);
};