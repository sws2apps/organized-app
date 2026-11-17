import {
  PublicWitnessingArrangementType,
  PublicWitnessingLocationType,
  PublicWitnessingWriteContext,
} from '@definition/public_witnessing';
import {
  dbPublicWitnessingArrangementGet,
  dbPublicWitnessingArrangementsSave,
} from '@services/dexie/public_witnessing_arrangements';
import {
  dbPublicWitnessingLocationDelete,
  dbPublicWitnessingLocationsReorder,
  dbPublicWitnessingLocationsSave,
} from '@services/dexie/public_witnessing_locations';
import {
  publicWitnessingArrangementWriteError,
  publicWitnessingLocationError,
} from '@utils/public_witnessing';

const requireManager = (context: PublicWitnessingWriteContext) => {
  if (!context.canManageLocations)
    throw new Error('error_api_unauthorized-request');
};

export const publicWitnessingSaveArrangement = async (
  arrangement: PublicWitnessingArrangementType,
  context: PublicWitnessingWriteContext
) => {
  const existing = await dbPublicWitnessingArrangementGet(
    arrangement.arrangement_uid
  );
  const error = publicWitnessingArrangementWriteError(
    arrangement,
    existing,
    context
  );
  if (error) throw new Error(error);

  await dbPublicWitnessingArrangementsSave(arrangement);
};

export const publicWitnessingSaveLocation = async (
  location: PublicWitnessingLocationType,
  context: PublicWitnessingWriteContext,
  expectedUpdatedAt?: string
) => {
  requireManager(context);
  const error = publicWitnessingLocationError(location);
  if (error) throw new Error(error);
  await dbPublicWitnessingLocationsSave(location, expectedUpdatedAt);
};

export const publicWitnessingReorderLocations = (
  locations: PublicWitnessingLocationType[],
  context: PublicWitnessingWriteContext
) => {
  requireManager(context);
  return dbPublicWitnessingLocationsReorder(locations);
};

export const publicWitnessingDeleteLocation = (
  location: PublicWitnessingLocationType,
  context: PublicWitnessingWriteContext
) => {
  requireManager(context);
  return dbPublicWitnessingLocationDelete(location);
};
