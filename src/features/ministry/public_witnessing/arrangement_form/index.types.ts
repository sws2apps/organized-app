import { PublicWitnessingLocationType } from '@definition/public_witnessing';
import { ShiftSlotType } from '../shifts_card/index.types';

export type ArrangementFormProps = {
  open: boolean;
  onClose: VoidFunction;
  location: PublicWitnessingLocationType;
  slot: ShiftSlotType;
};

export type PersonOption = {
  id: string;
  label: string;
};
