import { atom } from 'jotai';
import {
  PublicWitnessingArrangementType,
  PublicWitnessingLocationType,
  PublicWitnessingViewType,
} from '@definition/public_witnessing';
import { formatDate } from '@utils/date';
import { settingsState, userLocalUIDState } from '@states/settings';
import {
  publicWitnessingDeleteLocation,
  publicWitnessingReorderLocations,
  publicWitnessingSaveArrangement,
  publicWitnessingSaveLocation,
} from '@services/app/public_witnessing';

export const publicWitnessingLocationsDbState = atom<
  PublicWitnessingLocationType[]
>([]);

// Turns true once the locations have been read from IndexedDB, so an empty
// list can be told apart from one that has not loaded yet.
export const publicWitnessingLocationsLoadedState = atom(false);

export const publicWitnessingArrangementsDbState = atom<
  PublicWitnessingArrangementType[]
>([]);

// uid of the location opened in the details view, or null before the first
// location is auto-selected. (Cast instead of atom<string | null>(null): with
// strict mode off, a bare null matches jotai's read-only overload and the
// atom loses its setter.)
export const publicWitnessingSelectedLocationState = atom(
  null as string | null
);

// Day shown in the shifts card, "yyyy/MM/dd". In the week and month views it
// anchors the period the card displays.
export const publicWitnessingSelectedDateState = atom(
  formatDate(new Date(), 'yyyy/MM/dd')
);

// Period the shifts card lays out: a single day, a week, or a month.
export const publicWitnessingViewState = atom(
  'week' as PublicWitnessingViewType
);

export const publicWitnessingLocationsState = atom((get) => {
  const locations = get(publicWitnessingLocationsDbState);
  return locations
    .filter((record) => !record.location_data._deleted)
    .sort((a, b) => a.location_data.sort_index - b.location_data.sort_index);
});

export const publicWitnessingArrangementsState = atom((get) => {
  const arrangements = get(publicWitnessingArrangementsDbState);
  return arrangements.filter((record) => !record.arrangement_data._deleted);
});

export const publicWitnessingSelectedLocationRecordState = atom((get) => {
  const locations = get(publicWitnessingLocationsState);
  const selected = get(publicWitnessingSelectedLocationState);

  return locations.find((record) => record.location_uid === selected) ?? null;
});

export const publicWitnessingWriteContextState = atom((get) => {
  const settings = get(settingsState);
  const userUID = get(userLocalUIDState);
  const canManageLocations =
    settings.user_settings.cong_role.some(
      (role) =>
        role === 'admin' || role === 'coordinator' || role === 'secretary'
    ) ||
    Boolean(
      userUID && userUID === settings.cong_settings.responsabilities?.service
    );

  return { userUID, canManageLocations };
});

export const publicWitnessingSaveArrangementState = atom(
  null,
  (get, _set, arrangement: PublicWitnessingArrangementType) =>
    publicWitnessingSaveArrangement(
      arrangement,
      get(publicWitnessingWriteContextState)
    )
);
export const publicWitnessingSaveLocationState = atom(
  null,
  (
    get,
    _set,
    location: PublicWitnessingLocationType,
    expectedUpdatedAt?: string
  ) =>
    publicWitnessingSaveLocation(
      location,
      get(publicWitnessingWriteContextState),
      expectedUpdatedAt
    )
);
export const publicWitnessingReorderLocationsState = atom(
  null,
  (get, _set, locations: PublicWitnessingLocationType[]) =>
    publicWitnessingReorderLocations(
      locations,
      get(publicWitnessingWriteContextState)
    )
);
export const publicWitnessingDeleteLocationState = atom(
  null,
  (get, _set, location: PublicWitnessingLocationType) =>
    publicWitnessingDeleteLocation(
      location,
      get(publicWitnessingWriteContextState)
    )
);
