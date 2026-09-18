import appDb from '@db/appDb';
import { PublicWitnessingLocationType } from '@definition/public_witnessing';
import { dbPublicWitnessingArrangementsDeleteByLocation } from './public_witnessing_arrangements';

const dbUpdatePublicWitnessingLocationsMetadata = async () => {
  const metadata = await appDb.metadata.get(1);
  if (!metadata) return;
  metadata.metadata.public_witnessing_locations = {
    ...metadata.metadata.public_witnessing_locations,
    send_local: true,
  };
  await appDb.metadata.put(metadata);
};

export const dbPublicWitnessingLocationsSave = async (
  location: PublicWitnessingLocationType
) => {
  await appDb.transaction(
    'rw',
    appDb.public_witnessing_locations,
    appDb.metadata,
    async () => {
      await appDb.public_witnessing_locations.put(location);
      await dbUpdatePublicWitnessingLocationsMetadata();
    }
  );
};

export const dbPublicWitnessingLocationsBulkSave = async (
  locations: PublicWitnessingLocationType[]
) => {
  await appDb.transaction(
    'rw',
    appDb.public_witnessing_locations,
    appDb.metadata,
    async () => {
      await appDb.public_witnessing_locations.bulkPut(locations);
      await dbUpdatePublicWitnessingLocationsMetadata();
    }
  );
};

/**
 * Deletes a location together with its bookings in one transaction, so a
 * failed write cannot leave the location active without its arrangements.
 */
export const dbPublicWitnessingLocationDelete = async (
  location: PublicWitnessingLocationType
) => {
  const record = structuredClone(location);
  record.location_data._deleted = true;
  record.location_data.updatedAt = new Date().toISOString();

  await appDb.transaction(
    'rw',
    [
      appDb.public_witnessing_locations,
      appDb.public_witnessing_arrangements,
      appDb.metadata,
    ],
    async () => {
      await dbPublicWitnessingArrangementsDeleteByLocation(
        location.location_uid
      );
      await dbPublicWitnessingLocationsSave(record);
    }
  );
};

export const dbPublicWitnessingLocationsClear = async () => {
  const records = await appDb.public_witnessing_locations.toArray();
  if (records.length === 0) return;

  for (const record of records) {
    record.location_data._deleted = true;
    record.location_data.updatedAt = new Date().toISOString();
  }

  await dbPublicWitnessingLocationsBulkSave(records);
};
