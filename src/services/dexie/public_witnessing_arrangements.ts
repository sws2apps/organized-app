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
  await appDb.public_witnessing_arrangements.put(arrangement);
  await dbUpdatePublicWitnessingArrangementsMetadata();
};

export const dbPublicWitnessingArrangementsBulkSave = async (
  arrangements: PublicWitnessingArrangementType[]
) => {
  await appDb.public_witnessing_arrangements.bulkPut(arrangements);
  await dbUpdatePublicWitnessingArrangementsMetadata();
};

export const dbPublicWitnessingArrangementsClear = async () => {
  const records = await appDb.public_witnessing_arrangements.toArray();
  if (records.length === 0) return;
  for (const record of records) {
    record.arrangement_data._deleted = true;
    record.arrangement_data.updatedAt = new Date().toISOString();
  }
  await appDb.public_witnessing_arrangements.bulkPut(records);
};
