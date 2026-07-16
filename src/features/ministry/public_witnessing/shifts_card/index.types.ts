import {
  PublicWitnessingArrangementType,
  PublicWitnessingLocationType,
} from '@definition/public_witnessing';

export type ShiftSlotStatus = 'available' | 'partner_needed' | 'full' | 'past';

export type ShiftSlotType = {
  start_time: string;
  end_time: string;
  status: ShiftSlotStatus;
  /**
   * Display names of everyone arranged for this slot.
   */
  publishers: string[];
  arrangements: PublicWitnessingArrangementType[];
  /**
   * The arrangement the current user authored, if any — only its author
   * (and admins) may open and change it.
   */
  myArrangement?: PublicWitnessingArrangementType;
};

export type ShiftsCardProps = {
  location: PublicWitnessingLocationType;
};
