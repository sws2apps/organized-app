import { PublicWitnessingLocationType } from '@definition/public_witnessing';

export type LocationsListProps = {
  locations: PublicWitnessingLocationType[];
  selected: string | null;
  onSelect: (location_uid: string) => void;
};
