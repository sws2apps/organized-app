import { UpdateSpec } from 'dexie';
import appDb from '@db/appDb';
import { sourceSchema } from '@services/dexie/schema';
import { SourceWeekType } from '@definition/sources';
import { updateObject } from '@utils/common';

const dbUpdateSourcesMetadata = async () => {
  const metadata = await appDb.metadata.get(1);

  if (!metadata) return;

  metadata.metadata.sources = {
    ...metadata.metadata.sources,
    send_local: true,
  };

  await appDb.metadata.put(metadata);
};

export const dbSourcesSave = async (srcData: SourceWeekType) => {
  const findSource = await appDb.sources.get(srcData.weekOf);

  if (!findSource) {
    const newSource = structuredClone(sourceSchema);
    newSource.weekOf = srcData.weekOf;

    await appDb.sources.put(newSource);
  }

  const source = await appDb.sources.get(srcData.weekOf);

  const newSource = structuredClone(source);
  updateObject(newSource, srcData);

  await appDb.sources.put(newSource);
  await dbUpdateSourcesMetadata();
};

export const dbSourcesUpdate = async (
  weekOf: string,
  changes: UpdateSpec<SourceWeekType>
) => {
  await appDb.sources.update(weekOf, changes);
  await dbUpdateSourcesMetadata();
};

export const dbSourcesBulkPut = async (sources: SourceWeekType[]) => {
  await appDb.sources.bulkPut(sources);
  await dbUpdateSourcesMetadata();
};

export const dbSourcesUpdateEventsName = async () => {
  const sources = await appDb.sources.toArray();

  const sourcesToUpdate = sources.filter((source) => {
    const midweekEventsIsArray =
      source.midweek_meeting &&
      Array.isArray(source.midweek_meeting.event_name);

    const weekendEventsIsArray =
      source.weekend_meeting &&
      Array.isArray(source.weekend_meeting.event_name);

    return !midweekEventsIsArray || !weekendEventsIsArray;
  });

  if (sourcesToUpdate.length === 0) return;

  sourcesToUpdate.forEach((source) => {
    if (source.midweek_meeting) {
      const midweekEvent = source.midweek_meeting.event_name;
      if (typeof midweekEvent === 'object' && !Array.isArray(midweekEvent)) {
        source.midweek_meeting.event_name = [
          {
            type: 'main',
            value: midweekEvent['value'],
            updatedAt: midweekEvent['updatedAt'],
          },
        ];
      }
    }

    if (source.weekend_meeting) {
      const weekendEvent = source.weekend_meeting.event_name;

      if (typeof weekendEvent === 'object' && !Array.isArray(weekendEvent)) {
        source.weekend_meeting.event_name = [
          {
            type: 'main',
            value: weekendEvent['value'],
            updatedAt: weekendEvent['updatedAt'],
          },
        ];
      }
    }
  });

  await appDb.sources.bulkPut(sourcesToUpdate);
  await dbUpdateSourcesMetadata();
};
