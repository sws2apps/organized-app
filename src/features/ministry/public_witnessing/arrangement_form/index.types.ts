import {
  PublicWitnessingArrangementType,
  PublicWitnessingLocationType,
} from '@definition/public_witnessing';
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
  person_uid?: string;
};

export type PersonOption = {
  id: string;
  label: string;
};

export type ArrangementEditorProps = ArrangementFormProps & {
  arrangement?: PublicWitnessingArrangementType;
  selectedArrangementUID: string;
  onArrangementChange: (uid: string) => void;
};
