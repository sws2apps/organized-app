import appDb from '@db/appDb';
import { PublicWitnessingArrangementType } from '@definition/public_witnessing';

const dbUpdatePublicWitnessingArrangementsMetadata = async () => {
  const metadata = await appDb.metadata.get(1);
  if (!metadata) return;
  metadata.metadata.public_witnessing_arrangements = {
    ...metadata.metadata.public_witnessing_arrangements,
    send_local: true,
  };
  await appDb.metadata.put(metadata);
};

export const dbPublicWitnessingArrangementsSave = async (
  arrangement: PublicWitnessingArrangementType
) => {
  await appDb.transaction(
    'rw',
    appDb.public_witnessing_arrangements,
    appDb.metadata,
    async () => {
      await appDb.public_witnessing_arrangements.put(arrangement);
      await dbUpdatePublicWitnessingArrangementsMetadata();
    }
  );
};

const dbPublicWitnessingArrangementsBulkSave = async (
  arrangements: PublicWitnessingArrangementType[]
) => {
  await appDb.transaction(
    'rw',
    appDb.public_witnessing_arrangements,
    appDb.metadata,
    async () => {
      await appDb.public_witnessing_arrangements.bulkPut(arrangements);
      await dbUpdatePublicWitnessingArrangementsMetadata();
    }
  );
};

const softDelete = (record: PublicWitnessingArrangementType) => {
  record.arrangement_data._deleted = true;
  record.arrangement_data.updatedAt = new Date().toISOString();

  return record;
};

/**
 * Removes the bookings a location still holds — its shifts disappear with it,
 * so the arrangements could no longer be reached or cancelled.
 */
export const dbPublicWitnessingArrangementsDeleteByLocation = async (
  location_uid: string
) => {
  const records = await appDb.public_witnessing_arrangements
    .filter(
      (record) =>
        record.arrangement_data.location_uid === location_uid &&
        !record.arrangement_data._deleted
    )
    .toArray();

  if (records.length === 0) return;

  await dbPublicWitnessingArrangementsBulkSave(records.map(softDelete));
};

export const dbPublicWitnessingArrangementsClear = async () => {
  const records = await appDb.public_witnessing_arrangements.toArray();
  if (records.length === 0) return;

  await dbPublicWitnessingArrangementsBulkSave(records.map(softDelete));
};
