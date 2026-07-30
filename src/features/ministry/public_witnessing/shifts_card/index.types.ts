import {
  PublicWitnessingArrangementType,
  PublicWitnessingLocationType,
} from '@definition/public_witnessing';

export type ShiftSlotStatus = 'available' | 'partner_needed' | 'full' | 'past';

export type ShiftSlotType = {
  /**
   * Day the shift belongs to, "yyyy/MM/dd" — the week and month views show
   * slots of several days at once, so every slot carries its own date.
   */
  date: string;
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

export type DayShiftsType = {
  date: string;
  dateObj: Date;
  isToday: boolean;
  /**
   * False for the neighbouring-month days that pad the month grid.
   */
  inPeriod: boolean;
  slots: ShiftSlotType[];
};

export type ShiftsCardProps = {
  location: PublicWitnessingLocationType;
};

export type ShiftsViewProps = {
  days: DayShiftsType[];
  canInteract: (slot: ShiftSlotType) => boolean;
  onSelectSlot: (slot: ShiftSlotType) => void;
};

export type MonthViewProps = Omit<
  ShiftsViewProps,
  'canInteract' | 'onSelectSlot'
> & {
  onSelectDay: (date: string) => void;
};
