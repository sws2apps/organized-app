import Dexie from 'dexie';
import appDb from '@db/appDb';

export const dbAppDelete = async () => {
  await appDb.close();
  await Dexie.delete('organized');
};

export const dbAppOpen = async () => {
  await appDb.open();
};

export const dbAppGetAssignmentHistorySources = async () => {
  const [settings, schedules, sources, publicTalks] = await appDb.transaction(
    'r',
    [appDb.app_settings, appDb.sched, appDb.sources, appDb.public_talks],
    () =>
      Promise.all([
        appDb.app_settings.get(1),
        appDb.sched.toArray(),
        appDb.sources.toArray(),
        appDb.public_talks.toArray(),
      ])
  );

  return { settings, schedules, sources, publicTalks };
};
