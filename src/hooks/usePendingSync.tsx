import { useLiveQuery } from 'dexie-react-hooks';
import appDb from '@db/appDb';

/**
 * Data areas (persons, schedules, reports …) that have changes on this device
 * which have not been sent to the server yet.
 */
const usePendingSync = () => {
  const metadata = useLiveQuery(() => appDb.metadata.get(1));

  const pendingAreas = Object.entries(metadata?.metadata ?? {})
    .filter(([, value]) => value?.send_local)
    .map(([area]) => area);

  return { pendingAreas, pendingCount: pendingAreas.length };
};

export default usePendingSync;
