import { atom } from 'jotai';
import {
  PublicWitnessingArrangementType,
  PublicWitnessingLocationType,
} from '@definition/public_witnessing';
import { formatDate } from '@utils/date';

export const publicWitnessingLocationsDbState = atom<
  PublicWitnessingLocationType[]
>([]);

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

// Day shown in the shifts card, "yyyy/MM/dd".
export const publicWitnessingSelectedDateState = atom(
  formatDate(new Date(), 'yyyy/MM/dd')
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
