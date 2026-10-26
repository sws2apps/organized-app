import {
  publicWitnessingCapacityError,
  publicWitnessingLocationEditError,
} from '@utils/public_witnessing';
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
  location: PublicWitnessingLocationType,
  expectedUpdatedAt?: string
) => {
  await appDb.transaction(
    'rw',
    appDb.public_witnessing_locations,
    appDb.public_witnessing_arrangements,
    appDb.metadata,
    async () => {
      if (!location.location_data._deleted) {
        const current = await appDb.public_witnessing_locations.get(
          location.location_uid
        );
        const editError = publicWitnessingLocationEditError(
          current,
          expectedUpdatedAt
        );
        if (editError) throw new Error(editError);
        const records = await appDb.public_witnessing_arrangements.toArray();
        const error = publicWitnessingCapacityError(location, records);
        if (error) throw new Error(error);
      }
      await appDb.public_witnessing_locations.put(location);
      await dbUpdatePublicWitnessingLocationsMetadata();
    }
  );
};

export const dbPublicWitnessingLocationsReorder = async (
  locations: PublicWitnessingLocationType[]
) => {
  await appDb.transaction(
    'rw',
    appDb.public_witnessing_locations,
    appDb.metadata,
    async () => {
      for (const location of locations) {
        const current = await appDb.public_witnessing_locations.get(
          location.location_uid
        );
        if (!current || current.location_data._deleted) continue;
        // Reordering must never replace newer details or restore a deleted location.
        current.location_data.sort_index = location.location_data.sort_index;
        current.location_data.updatedAt = new Date().toISOString();
        await appDb.public_witnessing_locations.put(current);
      }
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
