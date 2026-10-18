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
  dbPublicWitnessingLocationsBulkSave,
  dbPublicWitnessingLocationsSave,
} from '@services/dexie/public_witnessing_locations';
import { publicWitnessingShiftError } from '@utils/public_witnessing';

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
  const data = arrangement.arrangement_data;

  if (
    !context.canManageLocations &&
    (!context.userUID ||
      data.created_by !== context.userUID ||
      (existing && existing.arrangement_data.created_by !== context.userUID) ||
      (!data._deleted &&
        !data.publishers.some(
          (person) => person.person_uid === context.userUID
        )))
  ) {
    throw new Error('error_api_unauthorized-request');
  }

  await dbPublicWitnessingArrangementsSave(arrangement);
};

export const publicWitnessingSaveLocation = async (
  location: PublicWitnessingLocationType,
  context: PublicWitnessingWriteContext
) => {
  requireManager(context);
  for (const day of location.location_data.schedule) {
    const error = publicWitnessingShiftError(day.shifts);
    if (error) throw new Error(error);
  }
  await dbPublicWitnessingLocationsSave(location);
};

export const publicWitnessingReorderLocations = (
  locations: PublicWitnessingLocationType[],
  context: PublicWitnessingWriteContext
) => {
  requireManager(context);
  return dbPublicWitnessingLocationsBulkSave(locations);
};

export const publicWitnessingDeleteLocation = (
  location: PublicWitnessingLocationType,
  context: PublicWitnessingWriteContext
) => {
  requireManager(context);
  return dbPublicWitnessingLocationDelete(location);
};
