import { PublicWitnessingLocationType } from '@definition/public_witnessing';

export type LocationDeleteProps = {
  open: boolean;
  onClose: VoidFunction;
  location: PublicWitnessingLocationType;
};
