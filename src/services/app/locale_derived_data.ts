import { dbAssignmentUpdate } from '@services/dexie/assignment';
import { dbPublicTalkUpdate } from '@services/dexie/public_talk';
import { dbSongUpdate } from '@services/dexie/songs';
import { dbWeekTypeUpdate } from '@services/dexie/weekType';
import { refreshLocalesResources } from '@services/i18n';

export const refreshLocaleDerivedData = async () => {
  await refreshLocalesResources();
  await dbAssignmentUpdate();
  await dbWeekTypeUpdate();
  await dbPublicTalkUpdate();
  await dbSongUpdate();
};
