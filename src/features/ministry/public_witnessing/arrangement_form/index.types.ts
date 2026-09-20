import { PublicWitnessingLocationType } from '@definition/public_witnessing';
import { ShiftSlotType } from '../shifts_card/index.types';

export type ArrangementFormProps = {
  open: boolean;
  onClose: VoidFunction;
  location: PublicWitnessingLocationType;
  slot: ShiftSlotType;
};

export type ArrangementMode = 'create' | 'join' | 'edit';

export type PartnerNameType = {
  id: string;
  name: string;
};

export type PersonOption = {
  id: string;
  label: string;
};
